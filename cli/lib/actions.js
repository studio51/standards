// Resolve every `uses: owner/repo@vN` in the scaffolded workflows to that
// action's latest major, so a fresh repo starts with nothing for Dependabot to
// bump. Pure Node built-ins; when GitHub can't be reached the template's pin
// stays as it is. A pin is only ever raised, never lowered.
import { execFileSync } from 'node:child_process';

const USES = /(uses:\s*["']?)([\w.-]+\/[\w.-]+)((?:\/[\w./-]+)?)@v(\d+)\b/g;
const API = 'https://api.github.com';

// A GitHub token if one is lying around (env, then the gh CLI); unauthenticated
// requests work too, within GitHub's hourly limit.
function findToken() {
  const env = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (env) return env;
  try {
    const out = execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() || null;
  } catch {
    return null;
  }
}

async function getJson(path, token) {
  const res = await fetch(`${API}/${path}`, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'studio51-create',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(5000),
  });
  return res.ok ? res.json() : null;
}

// The major of an action's latest release, but only when a moving `vN` ref
// exists for it, since that is what the workflow will reference. Most actions
// move a tag; some (ruby/setup-ruby) move a branch.
async function latestMajor(action, token) {
  const release = await getJson(`repos/${action}/releases/latest`, token);
  const major = release && /^v(\d+)/.exec(release.tag_name || '')?.[1];
  if (!major) return null;
  const ref =
    (await getJson(`repos/${action}/git/ref/tags/v${major}`, token)) ||
    (await getJson(`repos/${action}/git/ref/heads/v${major}`, token));
  return ref ? Number(major) : null;
}

// Rewrite the workflow outputs in place. Returns what was checked and raised.
export async function resolveActionMajors(outputs) {
  const workflows = outputs.filter((o) => o.content && o.dest.startsWith('.github/workflows/'));
  const pinned = new Map(); // action -> lowest major any workflow pins
  for (const { content } of workflows)
    for (const [, , action, , major] of content.matchAll(USES))
      pinned.set(action, Math.min(pinned.get(action) ?? Infinity, Number(major)));
  if (!pinned.size) return { checked: 0, resolved: 0, bumps: [] };

  const token = findToken();
  const latest = new Map();
  await Promise.all(
    [...pinned.keys()].map(async (action) => {
      try {
        const major = await latestMajor(action, token);
        if (major) latest.set(action, major);
      } catch {
        // Offline, rate-limited or timed out: keep the template's pin.
      }
    })
  );

  const raise = (action, major) => {
    const next = latest.get(action);
    return next && next > major ? next : null;
  };
  for (const output of workflows)
    output.content = output.content.replace(USES, (match, pre, action, path, major) => {
      const next = raise(action, Number(major));
      return next ? `${pre}${action}${path}@v${next}` : match;
    });

  const bumps = [...pinned]
    .map(([action, from]) => ({ action, from, to: raise(action, from) }))
    .filter((b) => b.to);
  return { checked: pinned.size, resolved: latest.size, bumps };
}
