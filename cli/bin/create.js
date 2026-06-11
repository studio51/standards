#!/usr/bin/env node
// @studio51/create: scaffold Studio51 standard files into a repo.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { buildTokens, stackLabel, resolveStacks, deriveStandard } from '../lib/tokens.js';
import {
  detectStack,
  detectDockerAddon,
  detectExistingYear,
  detectRepoName,
} from '../lib/detect.js';
import { generate } from '../lib/generate.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const TEMPLATES_DIR = join(REPO_ROOT, 'templates');
const CONFIG_PATH = join(REPO_ROOT, 'studio51.config.json');

const HELP = `studio51-create: scaffold Studio51 standard files

Usage:
  npx @studio51/create [options]            scaffold into the current directory
  npx @studio51/create update [options]     re-sync managed standard files only

Options:
  --name <name>          project / repo name (default: detected)
  --title <title>        display title (default: Title Case of name)
  --tagline <text>       one-line tagline for the README
  --description <text>   short paragraph for the README/AGENTS
  --type <type>          library | app | plugin | tool | service
  --stack <stack>        js-vanilla | js-react | rails | rails-hotwire | ruby-gem | python (default: detected)
  --standard <slug>      common | api-gem | app | app-nextjs | tool (default: derived from name/type/stack)
  --addons <list>        comma-separated, e.g. docker,demo
  --license <license>    MIT | Apache-2.0 | Proprietary (default: from config)
  --visibility <vis>     public | private (default: detected/config)
  --dir <path>           target directory (default: current directory)
  --force                overwrite existing files (create mode)
  --dry-run              show what would be written, write nothing
  --yes, -y              accept detected/default answers, no prompts
  --help, -h             this help
`;

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-y') args.flags.yes = true;
    else if (a === '-h') args.flags.help = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      if (['force', 'dry-run', 'yes', 'help'].includes(key)) args.flags[key] = true;
      else args.flags[key] = argv[++i];
    } else args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.help) return console.log(HELP);

  const mode = args._[0] === 'update' ? 'update' : 'create';
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  const targetDir = resolve(args.flags.dir || process.cwd());

  // --- detection ---
  const detectedStack = detectStack(targetDir) || config.defaults.stack;
  const detectedName = detectRepoName(targetDir);
  const existingYear = detectExistingYear(targetDir);
  const dockerDetected = detectDockerAddon(targetDir);

  const f = args.flags;
  const noPrompt = f.yes || mode === 'update';

  const rl = noPrompt ? null : createInterface({ input: stdin, output: stdout });
  const ask = async (q, def) => {
    if (!rl) return def;
    const a = (await rl.question(`${q}${def ? ` (${def})` : ''}: `)).trim();
    return a || def;
  };

  const name = f.name || (await ask('Project name', detectedName));
  const type = f.type || (await ask('Type [library|app|plugin|tool|service]', 'app'));
  const stack = f.stack || (await ask('Stack', detectedStack));
  const license =
    f.license || (await ask('License [MIT|Apache-2.0|Proprietary]', config.defaults.license));
  const visibility =
    f.visibility || (await ask('Visibility [public|private]', config.defaults.visibility));
  const standard =
    f.standard ||
    (await ask('Standard [common|api-gem|app|app-nextjs|tool]', deriveStandard({ name, type, stack })));
  const tagline = f.tagline || (await ask('Tagline', ''));
  const description = f.description || (await ask('Description', tagline));

  const addons = (f.addons ? f.addons.split(',') : [])
    .concat(dockerDetected && !f.addons ? ['docker'] : [])
    .map((s) => s.trim())
    .filter(Boolean);

  if (rl) rl.close();

  const stacks = resolveStacks(join(TEMPLATES_DIR, 'stacks'), stack, addons);
  const answers = {
    name,
    title: f.title,
    tagline,
    description,
    type,
    stack,
    addons,
    license,
    visibility,
    standard,
    existingYear,
    targetDir,
    stackLabel: stackLabel(join(TEMPLATES_DIR, 'stacks'), stacks),
  };
  const tokens = buildTokens(config, answers);

  console.log(`\nStudio51 standards → ${mode.toUpperCase()}`);
  console.log(`  target:     ${targetDir}`);
  console.log(`  project:    ${tokens.PROJECT_TITLE} (${type})`);
  console.log(`  stacks:     ${stacks.join(' + ')}  →  "${tokens.STACK_LABEL}"`);
  console.log(`  license:    ${license}   visibility: ${visibility}`);
  console.log(`  standard:   ${tokens.STANDARD_LABEL} ${tokens.STANDARD_VERSION}`);
  console.log(`  copyright:  ${tokens.YEAR_RANGE} ${tokens.LEGAL_NAME}\n`);

  const result = generate({
    templatesDir: TEMPLATES_DIR,
    config,
    tokens,
    answers,
    mode,
    force: f.force,
    dryRun: f['dry-run'],
  });

  const tag = f['dry-run'] ? '(dry-run) would write' : 'wrote';
  for (const dest of result.written) console.log(`  ✓ ${tag} ${dest}`);
  for (const [dest, why] of result.skipped) console.log(`  · skip ${dest}: ${why}`);
  console.log(
    `\n${result.written.length} file(s) ${f['dry-run'] ? 'planned' : 'written'}, ${result.skipped.length} skipped.`
  );
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
