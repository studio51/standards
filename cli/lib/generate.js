// Build the file plan and write it. Pure Node built-ins.
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  chmodSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { render } from './render.js';
import { resolveStacks } from './tokens.js';
import { resolveActionMajors } from './actions.js';

// Files that `update` may regenerate in place; they hold no project-specific
// prose, so refreshing them just re-syncs the standard.
const MANAGED_META = [
  'LICENSE',
  'NOTICE',
  'COPYRIGHT',
  'AGENTS.md',
  'CLAUDE.md',
  'CURSOR.md',
  'CODEX.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  '.editorconfig',
  '.gitattributes',
  '.vscode/extensions.json',
  '.vscode/settings.json',
  '.githooks/commit-msg',
  '.claude/settings.json',
];
const isManagedMeta = (dest) => MANAGED_META.includes(dest) || dest.startsWith('.github/');

// When more than one stack contributes the same file, how do we combine them?
const LINE_MERGE = new Set(['.gitignore', '.dockerignore']);

// JSON files the standard only adds keys to. An existing copy is merged, not
// replaced, so a repo's own settings (permissions, hooks) survive.
const JSON_MERGE = new Set(['.claude/settings.json', '.vscode/settings.json', '.vscode/extensions.json']);

// Repo-owned regions of managed files. Rewriting the file keeps the repo's own
// text in them: the "This repository" section of AGENTS.md, and everything
// below the marker line in the agent pointer files.
const REPO_SECTION = /<!-- REPO_SECTION[\s\S]*?<!-- \/REPO_SECTION -->/;
const POINTER_TAIL = /<!-- [^\n]*go below this line\. -->[\s\S]*$/;
const POINTERS = new Set(['CLAUDE.md', 'CURSOR.md', 'CODEX.md']);

function keepRepoText(dest, content, current) {
  const region = dest === 'AGENTS.md' ? REPO_SECTION : POINTERS.has(dest) ? POINTER_TAIL : null;
  const mine = region && current.match(region);
  return mine ? content.replace(region, () => mine[0]) : content;
}

// Deep-merge `ours` into `theirs`: objects merge key by key, arrays keep the
// repo's entries and add the standard's, anything else takes the standard's value.
function mergeJson(theirs, ours) {
  const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(theirs) && Array.isArray(ours))
    return [...theirs, ...ours.filter((v) => !theirs.some((t) => JSON.stringify(t) === JSON.stringify(v)))];
  if (!isObject(theirs) || !isObject(ours)) return ours;
  const out = { ...theirs };
  for (const [key, value] of Object.entries(ours)) out[key] = mergeJson(theirs[key], value);
  return out;
}

function walk(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, base, out);
    else out.push(relative(base, abs));
  }
  return out;
}

const destName = (rel) => (rel.endsWith('.tmpl') ? rel.slice(0, -'.tmpl'.length) : rel);

// dest -> [{ src, stack }]  (later entries = higher precedence for overwrite)
function buildPlan({ templatesDir, stacks }) {
  const plan = new Map();
  const push = (dest, src, stack = null) => {
    if (!plan.has(dest)) plan.set(dest, []);
    plan.get(dest).push({ src, stack });
  };

  const commonDir = join(templatesDir, 'common');
  for (const rel of walk(commonDir)) {
    if (destName(rel) === 'AGENTS.md') continue; // handled specially
    push(destName(rel), join(commonDir, rel));
  }
  for (const s of stacks) {
    const filesDir = join(templatesDir, 'stacks', s, 'files');
    for (const rel of walk(filesDir)) push(destName(rel), join(filesDir, rel), s);
  }
  return plan;
}

// Union of lines across overlays: keeps every comment/header, dedupes patterns.
function mergeLines(contents) {
  const out = [];
  const seen = new Set();
  for (const content of contents) {
    if (out.length) out.push('');
    for (const line of content.replace(/\n+$/, '').split('\n')) {
      if (line.trim() === '') {
        if (out.length && out[out.length - 1] !== '') out.push('');
      } else if (line.startsWith('#')) {
        out.push(line); // always keep comments/headers
      } else if (!seen.has(line)) {
        seen.add(line);
        out.push(line);
      }
    }
  }
  return out.join('\n') + '\n';
}

// --- update: files the repo owns once they exist ---
// CI workflows and dependabot.yml are scaffolded once, then belong to the repo
// (services, extra jobs, extra directories). `update` never replaces them; it
// only brings them up to the standard in place.

const isOwnedWorkflow = (dest) =>
  dest.startsWith('.github/workflows/') && dest !== '.github/workflows/standards.yml';

// CI runs on every integration branch, since work lands there directly.
function widenTriggers(workflow) {
  return workflow.replace(/(\n\s*push:\s*\n\s*branches:\s*)\[\s*main\s*\]/, '$1[develop, main, master]');
}

// Give every ecosystem block the standard's commit prefix and grouping, keep
// everything else the repo set (directories, schedules, limits), and add the
// ecosystems the standard expects but the repo lacks.
function upgradeDependabot(existing, template) {
  const lines = existing.replace(/\s+$/, '').split('\n');
  const isStart = (l) => /^\s*- package-ecosystem:/.test(l);
  const starts = lines.flatMap((l, i) => (isStart(l) ? [i] : []));
  if (!starts.length) return template;
  const listIndent = /^(\s*)-/.exec(lines[starts[0]])[1];
  const key = listIndent + '  ';
  const out = lines.slice(0, starts[0]);
  const ecosystems = new Set();
  starts.forEach((start, n) => {
    const block = lines.slice(start, starts[n + 1] ?? lines.length);
    while (block.length > 1 && block[block.length - 1].trim() === '') block.pop();
    const eco = /package-ecosystem:\s*["']?([\w-]+)/.exec(block[0])[1];
    ecosystems.add(eco);
    const has = (k) => block.some((l) => l.startsWith(`${key}${k}:`));
    if (!has('commit-message')) block.push(`${key}commit-message:`, `${key}  prefix: chore`, `${key}  include: scope`);
    if (!has('groups')) block.push(`${key}groups:`, `${key}  ${eco}:`, `${key}    patterns: ["*"]`);
    out.push(...block);
  });
  const re = /( {2}- package-ecosystem:\s*"?([\w-]+)"?[\s\S]*?)(?=\n {2}- package-ecosystem:|\s*$)/g;
  for (const [, block, eco] of template.matchAll(re))
    if (!ecosystems.has(eco)) out.push(...block.split('\n').map((l) => l.replace(/^ {2}/, listIndent)));
  return out.join('\n') + '\n';
}

// Merge dependabot `updates:` blocks, deduped by package-ecosystem. The first
// overlay's leading comment header is kept.
function mergeDependabot(contents) {
  const header = (contents[0].match(/^(#.*\n)+/) || [''])[0];
  const blocks = [];
  const seenEco = new Set();
  for (const content of contents) {
    const re = /( {2}- package-ecosystem:\s*"?([\w-]+)"?[\s\S]*?)(?=\n {2}- package-ecosystem:|\s*$)/g;
    let m;
    while ((m = re.exec(content))) {
      const eco = m[2];
      if (seenEco.has(eco)) continue;
      seenEco.add(eco);
      blocks.push(m[1].replace(/\s+$/, ''));
    }
  }
  return `${header}version: 2\nupdates:\n${blocks.join('\n')}\n`;
}

const BINARY = /\.(png|jpe?g|gif|ico|woff2?|pdf)$/i;
const readText = (src, tokens) => render(readFileSync(src, 'utf8'), tokens);

function renderAgents({ templatesDir, stacks, tokens }) {
  const shell = render(readFileSync(join(templatesDir, 'common', 'AGENTS.md.tmpl'), 'utf8'), tokens);
  const sections = stacks
    .map((s) => {
      const meta = JSON.parse(readFileSync(join(templatesDir, 'stacks', s, 'stack.json'), 'utf8'));
      if (!meta.agentsSection) return '';
      const p = join(templatesDir, 'stacks', s, meta.agentsSection);
      return existsSync(p) ? render(readFileSync(p, 'utf8'), tokens).trim() : '';
    })
    .filter(Boolean)
    .join('\n\n');
  return shell.replace(
    /<!-- STACK_SECTION[\s\S]*?\/STACK_SECTION -->/,
    sections || '## Stack\n\n' + tokens.STACK_LABEL
  );
}

// Returns [{ dest, content|buffer }] fully resolved.
function resolveOutputs({ templatesDir, stacks, tokens }) {
  const plan = buildPlan({ templatesDir, stacks });
  const outputs = [];

  for (const [dest, sources] of plan) {
    // CI workflow from >1 stack → keep them separate, suffixed per stack.
    if (dest === '.github/workflows/ci.yml' && sources.filter((s) => s.stack).length > 1) {
      for (const { src, stack } of sources) {
        if (!stack) continue;
        outputs.push({ dest: `.github/workflows/ci-${stack}.yml`, content: readText(src, tokens) });
      }
      continue;
    }
    if (sources.length === 1) {
      const { src } = sources[0];
      const executable = (statSync(src).mode & 0o111) !== 0;
      outputs.push(
        BINARY.test(src)
          ? { dest, buffer: readFileSync(src), executable }
          : { dest, content: readText(src, tokens), executable }
      );
      continue;
    }
    // Multiple sources for one dest → merge or last-wins.
    const texts = sources.map((s) => readText(s.src, tokens));
    if (LINE_MERGE.has(dest)) outputs.push({ dest, content: mergeLines(texts) });
    else if (dest === '.github/dependabot.yml') outputs.push({ dest, content: mergeDependabot(texts) });
    else outputs.push({ dest, content: texts[texts.length - 1] }); // last stack wins
  }

  // License + (Apache) NOTICE
  outputs.push({
    dest: 'LICENSE',
    content: readText(join(templatesDir, 'licenses', `${tokens.LICENSE}.tmpl`), tokens),
  });
  if (tokens.LICENSE === 'Apache-2.0')
    outputs.push({
      dest: 'NOTICE',
      content: readText(join(templatesDir, 'licenses', 'NOTICE.tmpl'), tokens),
    });

  // AGENTS.md (common shell + injected stack sections)
  outputs.push({ dest: 'AGENTS.md', content: renderAgents({ templatesDir, stacks, tokens }) });

  return outputs;
}

export async function generate({ templatesDir, tokens, answers, mode, force, dryRun, offline }) {
  const stacks = resolveStacks(join(templatesDir, 'stacks'), answers.stack, answers.addons || []);
  const outputs = resolveOutputs({ templatesDir, stacks, tokens });
  if (mode === 'update')
    for (const o of outputs) {
      const abs = join(answers.targetDir, o.dest);
      if (!o.content || !existsSync(abs)) continue;
      if (isOwnedWorkflow(o.dest)) o.content = widenTriggers(readFileSync(abs, 'utf8'));
      else if (o.dest === '.github/dependabot.yml')
        o.content = upgradeDependabot(readFileSync(abs, 'utf8'), o.content);
    }
  const actions = offline ? null : await resolveActionMajors(outputs);

  const written = [];
  const skipped = [];
  for (let { dest, content, buffer, executable } of outputs) {
    const destAbs = join(answers.targetDir, dest);
    const exists = existsSync(destAbs);

    if (mode === 'update' && !isManagedMeta(dest)) {
      skipped.push([dest, 'project content (update skips it)']);
      continue;
    }
    if (JSON_MERGE.has(dest) && exists) {
      const current = readFileSync(destAbs, 'utf8');
      try {
        content = JSON.stringify(mergeJson(JSON.parse(current), JSON.parse(content)), null, 2) + '\n';
      } catch {
        skipped.push([dest, 'existing file is not valid JSON, fix it and re-run']);
        continue;
      }
      if (content === current) {
        skipped.push([dest, 'already up to date']);
        continue;
      }
    } else if (mode === 'create' && exists && !force) {
      skipped.push([dest, 'already exists (use --force)']);
      continue;
    } else if (exists && (dest === 'AGENTS.md' || POINTERS.has(dest))) {
      const current = readFileSync(destAbs, 'utf8');
      if (dest === 'AGENTS.md' && !REPO_SECTION.test(current) && !force) {
        skipped.push([dest, 'no "This repository" section yet: move repo-specific text into it, or re-run with --force']);
        continue;
      }
      content = keepRepoText(dest, content, current);
    }
    if (!dryRun) {
      mkdirSync(dirname(destAbs), { recursive: true });
      writeFileSync(destAbs, buffer ?? content);
      if (executable) chmodSync(destAbs, 0o755);
    }
    written.push(dest);
  }
  if (mode === 'update' && refreshAdherence(answers.targetDir, tokens, dryRun))
    written.push('README.md (standard line)');
  return { written, skipped, stacks, actions };
}

// The README is project content, except for the sentence declaring which
// standard the repo adheres to; `update` moves that one to the current version.
const ADHERENCE = /\[Studio51\s+Solutions\s+[^\]]+?\s+Standard\s+v\d+\]\([^)]*\)/;
function refreshAdherence(targetDir, tokens, dryRun) {
  const path = join(targetDir, 'README.md');
  if (!existsSync(path)) return false;
  const readme = readFileSync(path, 'utf8');
  const { STANDARD_LABEL: label, STANDARD_SLUG: slug, STANDARD_VERSION: version } = tokens;
  const link =
    `[Studio51 Solutions ${label} Standard ${version}]` +
    `(https://github.com/studio51/standards/blob/main/standards/${slug}/${version}/STANDARD.md)`;
  const next = readme.replace(ADHERENCE, () => link);
  if (next === readme) return false;
  if (!dryRun) writeFileSync(path, next);
  return true;
}

// Point git at the scaffolded hooks (`.githooks/`) unless the repo already uses
// another hooks directory. Returns a one-line status, or null outside a repo.
export function enableHooks(targetDir, dryRun) {
  const git = (...args) =>
    execFileSync('git', ['-C', targetDir, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  try {
    git('rev-parse', '--git-dir');
  } catch {
    return null;
  }
  let current = '';
  try {
    current = git('config', '--get', 'core.hooksPath');
  } catch {
    // unset
  }
  if (current === '.githooks') return 'git hooks already enabled (core.hooksPath=.githooks)';
  if (current)
    return `core.hooksPath is ${current}; call .githooks/commit-msg from there to enforce the commit rules`;
  if (!dryRun) git('config', 'core.hooksPath', '.githooks');
  return `${dryRun ? 'would enable' : 'enabled'} git hooks (core.hooksPath=.githooks)`;
}
