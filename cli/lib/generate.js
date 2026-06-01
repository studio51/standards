// Build the file plan and write it. Pure Node built-ins.
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { render } from './render.js';
import { resolveStacks } from './tokens.js';

// Files that `update` may regenerate in place; they hold no project-specific
// prose, so refreshing them just re-syncs the standard.
const MANAGED_META = [
  'LICENSE',
  'NOTICE',
  'COPYRIGHT',
  'AGENTS.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  '.editorconfig',
  '.gitattributes',
];
const isManagedMeta = (dest) => MANAGED_META.includes(dest) || dest.startsWith('.github/');

// When more than one stack contributes the same file, how do we combine them?
const LINE_MERGE = new Set(['.gitignore', '.dockerignore']);

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

// Merge dependabot `updates:` blocks, deduped by package-ecosystem.
function mergeDependabot(contents) {
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
  return `version: 2\nupdates:\n${blocks.join('\n')}\n`;
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
      outputs.push(
        BINARY.test(src)
          ? { dest, buffer: readFileSync(src) }
          : { dest, content: readText(src, tokens) }
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

export function generate({ templatesDir, tokens, answers, mode, force, dryRun }) {
  const stacks = resolveStacks(join(templatesDir, 'stacks'), answers.stack, answers.addons || []);
  const outputs = resolveOutputs({ templatesDir, stacks, tokens });

  const written = [];
  const skipped = [];
  for (const { dest, content, buffer } of outputs) {
    const destAbs = join(answers.targetDir, dest);
    const exists = existsSync(destAbs);

    if (mode === 'update' && !isManagedMeta(dest)) {
      skipped.push([dest, 'project content (update skips it)']);
      continue;
    }
    if (mode === 'create' && exists && !force) {
      skipped.push([dest, 'already exists (use --force)']);
      continue;
    }
    if (!dryRun) {
      mkdirSync(dirname(destAbs), { recursive: true });
      writeFileSync(destAbs, buffer ?? content);
    }
    written.push(dest);
  }
  return { written, skipped, stacks };
}
