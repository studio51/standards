// Apply the Studio51 standard repository settings through the GitHub API, via
// the gh CLI: merge commits only, head branches deleted on merge, and the
// "Studio51 standard" ruleset (signed commits, no force pushes, no deletion)
// on the integration and release branches.
// Mirrors templates/common/.github/settings.yml; keep the two in step.
import { execFileSync } from 'node:child_process';

// --- The standard ---

export const REPOSITORY = {
  has_issues: true,
  has_projects: true,
  has_wiki: true,
  has_discussions: true,
  allow_merge_commit: true, // merge commits only
  allow_squash_merge: false,
  allow_rebase_merge: false,
  merge_commit_title: 'PR_TITLE',
  merge_commit_message: 'PR_BODY',
  allow_update_branch: true,
  delete_branch_on_merge: true,
  web_commit_signoff_required: true,
};

export const RULESET = {
  name: 'Studio51 standard',
  target: 'branch',
  enforcement: 'active',
  conditions: {
    ref_name: {
      include: ['~DEFAULT_BRANCH', 'refs/heads/develop', 'refs/heads/main', 'refs/heads/master'],
      exclude: [],
    },
  },
  rules: [{ type: 'required_signatures' }, { type: 'non_fast_forward' }, { type: 'deletion' }],
  bypass_actors: [],
};

// --- gh plumbing ---

function gh(args, { input, cwd } = {}) {
  return execFileSync('gh', args, {
    cwd,
    input,
    encoding: 'utf8',
    stdio: [input ? 'pipe' : 'ignore', 'pipe', 'pipe'],
  });
}

function api(method, path, body) {
  const args = ['api', '-X', method, path];
  if (body) args.push('--input', '-');
  const out = gh(args, { input: body && JSON.stringify(body) });
  return out.trim() ? JSON.parse(out) : null;
}

function exists(path) {
  try {
    api('GET', path);
    return true;
  } catch {
    return false;
  }
}

// The repo to configure: --repo when given, otherwise the one the target
// directory's git remote points at.
export function resolveRepo(targetDir, repoFlag) {
  if (repoFlag) return repoFlag;
  return gh(['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], { cwd: targetDir }).trim();
}

// Apply (or, with dryRun, only report) the standard settings on `repo`.
// Returns a list of human-readable lines describing what changed or would.
export function applySettings({ repo, dryRun }) {
  const lines = [];
  const verb = dryRun ? 'would set' : 'set';

  const current = api('GET', `repos/${repo}`);
  const changes = Object.fromEntries(
    Object.entries(REPOSITORY).filter(([key, value]) => current[key] !== value)
  );
  for (const [key, value] of Object.entries(changes))
    lines.push(`${verb} ${key}: ${JSON.stringify(current[key])} → ${JSON.stringify(value)}`);
  if (!Object.keys(changes).length) lines.push('repository settings already standard');
  else if (!dryRun) api('PATCH', `repos/${repo}`, changes);

  const rulesets = api('GET', `repos/${repo}/rulesets?includes_parents=false`) || [];
  const ours = rulesets.find((r) => r.name === RULESET.name);
  if (!dryRun) {
    if (ours) api('PUT', `repos/${repo}/rulesets/${ours.id}`, RULESET);
    else api('POST', `repos/${repo}/rulesets`, RULESET);
  }
  lines.push(
    `${ours ? (dryRun ? 'would update' : 'updated') : dryRun ? 'would create' : 'created'} ` +
      `ruleset "${RULESET.name}" (signed commits, no force push, no deletion on the default branch, develop, main, master)`
  );
  for (const other of rulesets.filter((r) => r.name !== RULESET.name))
    lines.push(`note: ruleset "${other.name}" (${other.enforcement}) also applies; review it by hand`);

  if (current.default_branch !== 'develop' && exists(`repos/${repo}/branches/develop`))
    lines.push(
      `note: develop exists but the default branch is ${current.default_branch}; ` +
        `switch it with: gh repo edit ${repo} --default-branch develop`
    );
  return lines;
}
