// Best-effort detection of stack / visibility / existing copyright year from the
// target directory. All detection is advisory — the user confirms before writing.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

function has(dir, name) {
  return existsSync(join(dir, name));
}

function anyFileMatches(dir, ext) {
  try {
    return readdirSync(dir).some((f) => f.endsWith(ext));
  } catch {
    return false;
  }
}

export function detectStack(dir) {
  // Order matters: most specific first.
  if (has(dir, 'config/importmap.rb') || has(dir, join('app', 'javascript', 'controllers')))
    return 'rails-hotwire';
  if (has(dir, 'Gemfile') || has(dir, 'config/application.rb') || anyFileMatches(dir, '.gemspec'))
    return 'rails';
  if (has(dir, 'package.json')) {
    try {
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.react || deps.next) return 'js-react';
    } catch {
      /* ignore */
    }
    if (anyFileMatches(dir, '.jsx') || anyFileMatches(dir, '.tsx')) return 'js-react';
  }
  if (anyFileMatches(dir, '.jsx') || anyFileMatches(dir, '.tsx')) return 'js-react';
  if (has(dir, 'index.html') || anyFileMatches(dir, '.js')) return 'js-vanilla';
  return null;
}

export function detectDockerAddon(dir) {
  return has(dir, 'Dockerfile') || has(dir, 'compose.yaml') || has(dir, 'docker-compose.yml');
}

// Try to read the earliest copyright year from an existing LICENSE/COPYRIGHT.
export function detectExistingYear(dir) {
  for (const name of ['LICENSE', 'LICENSE.txt', 'LICENSE.md', 'COPYRIGHT']) {
    if (!has(dir, name)) continue;
    try {
      const text = readFileSync(join(dir, name), 'utf8');
      const m = text.match(/(?:Copyright(?:\s*\(c\))?\s*)(\d{4})/i);
      if (m) return m[1];
    } catch {
      /* ignore */
    }
  }
  return null;
}

// Detect repo name from git remote or directory name.
export function detectRepoName(dir) {
  try {
    const url = execSync('git -C "' + dir + '" remote get-url origin', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    const m = url.match(/([^/:]+?)(?:\.git)?$/);
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  return dir.split('/').filter(Boolean).pop() || 'project';
}
