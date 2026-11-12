// The repo manifest, `.studio51.json`: the answers a repo was scaffolded with
// (name, title, type, stack, add-ons, license, visibility, standard), so
// `update` re-renders the standard files exactly as the repo chose them rather
// than from the org defaults. Repos scaffolded before the manifest existed get
// one inferred from what they already carry.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { detectStack, detectDockerAddon, detectRepoName } from './detect.js';

export const MANIFEST = '.studio51.json';
const KEYS = ['name', 'title', 'tagline', 'description', 'type', 'stack', 'addons', 'license', 'visibility', 'standard'];

// README label → standard slug. "App" is the App (Rails) standard's old name.
const LABEL_TO_SLUG = {
  common: 'common',
  'api gem': 'api-gem',
  app: 'app-rails',
  'app (rails)': 'app-rails',
  'app (next.js)': 'app-nextjs',
  'app (swift)': 'app-swift',
  tool: 'tool',
};
const TYPE_FOR_STANDARD = {
  'api-gem': 'library',
  'app-rails': 'app',
  'app-nextjs': 'app',
  'app-swift': 'app',
  tool: 'tool',
};

const read = (dir, name) => (existsSync(join(dir, name)) ? readFileSync(join(dir, name), 'utf8') : '');

export function readManifest(dir) {
  const text = read(dir, MANIFEST);
  return text ? JSON.parse(text) : null;
}

export function writeManifest(dir, answers) {
  const manifest = Object.fromEntries(
    KEYS.filter((k) => answers[k] !== undefined && answers[k] !== '').map((k) => [k, answers[k]])
  );
  writeFileSync(join(dir, MANIFEST), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

// Best-effort answers for a repo with no manifest, read from its README,
// AGENTS.md, LICENSE and files. Anything not found is left out, so the CLI's
// own defaults (or flags) fill it.
export function inferManifest(dir) {
  const readme = read(dir, 'README.md');
  const agents = read(dir, 'AGENTS.md');
  const license = read(dir, 'LICENSE') || read(dir, 'LICENSE.md') || read(dir, 'LICENSE.txt');
  const out = { name: detectRepoName(dir) };

  const title = /^#\s+(.+)$/m.exec(readme)?.[1]?.replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim();
  if (title) out.title = title;

  // AGENTS.md "## Project": "- **Name:** x · **Type:** y · **License:** z", then a description bullet.
  const project = /## Project\s*\n([\s\S]*?)(?=\n## )/.exec(agents)?.[1] || '';
  const type = /\*\*Type:\*\*\s*([\w-]+)/.exec(project)?.[1];
  const agentsLicense = /\*\*License:\*\*\s*([\w.-]+)/.exec(project)?.[1];
  const description = project
    .split('\n')
    .filter((l) => /^- /.test(l) && !/\*\*Name:\*\*/.test(l))
    .map((l) => l.slice(2).trim())[0];
  if (description) out.description = description;

  const label = /\[Studio51\s+Solutions\s+([^\]]+?)\s+Standard\s+v\d+\]/.exec(readme)?.[1];
  const standard = label && LABEL_TO_SLUG[label.replace(/\s+/g, ' ').toLowerCase()];
  if (standard) out.standard = standard;
  out.type = type || TYPE_FOR_STANDARD[standard] || undefined;

  if (/^\s*MIT License/i.test(license)) out.license = 'MIT';
  else if (/Apache License/i.test(license)) out.license = 'Apache-2.0';
  else if (license) out.license = 'Proprietary';
  else if (agentsLicense) out.license = agentsLicense;

  const stack = detectStack(dir);
  if (stack) out.stack = stack;
  const addons = [];
  if (detectDockerAddon(dir)) addons.push('docker');
  if (existsSync(join(dir, '.github/workflows/pages.yml'))) addons.push('demo');
  out.addons = addons;

  try {
    const visibility = execFileSync('gh', ['repo', 'view', '--json', 'visibility', '-q', '.visibility'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (visibility) out.visibility = visibility.toLowerCase();
  } catch {
    // no gh, or not a GitHub repo: the config default applies
  }
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}
