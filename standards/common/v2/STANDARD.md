# Studio51 Solutions Common Standard · v2

> The baseline every Studio51 Solutions repository adheres to, regardless of
> stack or type. Type-specific standards ([API Gem](../../api-gem/v2/STANDARD.md),
> [App (Rails)](../../app-rails/v2/STANDARD.md), [App (Next.js)](../../app-nextjs/v2/STANDARD.md),
> [App (Swift)](../../app-swift/v2/STANDARD.md), [Tool](../../tool/v1/STANDARD.md))
> extend this document; they never relax it.

## What changed since v1

- **Work lands straight on the integration branch** (`develop`, else `main` /
  `master`); pull requests are no longer required for our own work.
- **One author, always:** every commit is the repo owner's own signed commit,
  with no co-author of any kind. Enforced by a `commit-msg` hook, CI, and the
  agents' own settings.
- **Meaningful commits** are now defined, and checked.
- **Merge commits only:** squash and rebase merging are switched off; history
  is never rewritten.
- **Clean up after yourself:** finished work leaves nothing unpushed, no stray
  worktrees, and no local branches.
- **Dependency currency:** the latest secure release of everything, with no
  version constraints in manifests.
- **Repository settings are applied by the CLI** (`npx @studio51/create
  settings`), including the signed-commit ruleset.
- **Railway, Cloudflare and R2:** every app is ready to deploy on Railway, talks
  to Cloudflare for domains, CDN and storage, and keeps persistent files in its
  own R2 bucket, filed so a person can browse them.

## How standards are versioned

- Each standard lives in this repo under `standards/<slug>/<version>/STANDARD.md`
  and evolves through versioned directories (`v1`, `v2`, …) on `main`.
- A repo declares the standard it adheres to in its README **Navigation**
  section (see below) and is tracked in the org-wide
  [repository registry](../../../README.md#repository-registry) in the
  standards repo's README.
- A new version is a new directory; published versions are never rewritten,
  only errata-fixed. Repos migrate deliberately, one repo at a time.

## Repository skeleton

Every repo carries the canonical skeleton, scaffolded by `npx @studio51/create`:

- `README.md`, minimal by standard: screenshot, title, tagline/description,
  the **Navigation** menu, and the license. Nothing else; enforced by
  `.github/workflows/standards.yml`.
- `docs/`, all prose: `ARCHITECTURE.md`, `INSTALL.md`, `USAGE.md`, plus any
  type-specific documents. Each concern is documented properly in its own file.
- `LICENSE` + `COPYRIGHT` (and `NOTICE` for Apache-2.0).
- `AGENTS.md`, shared agent/human conventions, plus pointer files `CLAUDE.md`,
  `CURSOR.md`, and `CODEX.md` (see **Agent instructions** below).
- `.claude/settings.json`, with Claude Code's commit and PR attribution
  switched off.
- `.githooks/commit-msg`, the commit rules enforced before a commit exists.
- `.github/`: issue/PR templates, `CODEOWNERS` (a real GitHub user/team),
  dependabot, CI, the standards check, and `settings.yml`.
- Hygiene: `.editorconfig`, `.gitattributes`, `CHANGELOG.md`, `SECURITY.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.

## README Navigation

The README's docs menu is titled **Navigation**. Directly under the heading it
states which standard the repo adheres to, then links each documented section:

```markdown
## Navigation

This repository adheres to the [Studio51 Solutions API Gem Standard v2](…),
with each section documented properly in its own file.

- [Architecture](docs/ARCHITECTURE.md)
- [Install & setup](docs/INSTALL.md)
- [Usage](docs/USAGE.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
```

## Code documentation

Comments are part of the standard, required and not optional:

- Document **every public method, class, module, and constant** with a comment
  block directly above it: a short sentence on what it is/does, then each
  parameter and the return value.
- Separate prose from parameter/return tags with one blank comment line; keep a
  blank comment line as the last line of a class/module doc block.
- One sentence per line; don't hard-wrap a sentence.
- Inline trailing comments for accessors, struct fields, and grouped constants.
- Group related members under short `# --- Section ---` dividers.
- Anything reverse-engineered, inferred, or otherwise unverified is **flagged as
  such** in the doc comment and the user docs, with the procedure that can
  confirm it.

The exact doc-comment syntax per language lives in each repo's `AGENTS.md`
stack section (YARD for Ruby).

## Agent instructions

- `AGENTS.md` is the single source of truth for working conventions; it serves
  agents and humans alike.
- `CLAUDE.md`, `CURSOR.md`, and `CODEX.md` exist as thin pointer files that
  instruct each agent to read and adhere to `AGENTS.md`. Anything that can be
  shared goes into `AGENTS.md`; only instructions truly specific to one agent
  go below the marker line in that agent's file.
- Anything this repo does differently from the standard (a different target
  branch, a release step) is stated in the **This repository** section at the
  end of `AGENTS.md`. That section, and everything below the marker line in
  the pointer files, survives `npx @studio51/create update`.
- Agents follow the workflow rules below exactly as a human would. Their tools
  are configured not to add attribution (`.claude/settings.json` clears
  Claude Code's `attribution`); an agent that adds a trailer anyway is wrong,
  and the `commit-msg` hook rejects the commit.

## Workflow conventions

These rules apply to agents and humans alike.

### Where work lands

- **Every commit goes straight to the integration branch:** `develop` when the
  repo has one, otherwise `main` (or `master`). No pull request, no pushed
  feature branch.
- **Unless the repo says otherwise.** A repo states its own flow in the **This
  repository** section of its `AGENTS.md`, and that statement wins.
  `games.directory` is the standing example: work lands on `develop` and is
  then released to `master` through its release process (`RELEASE.md`).
- **`develop` is the default branch** wherever it exists, so Dependabot and
  outside pull requests target it; `main` / `master` move only on release.
- **Local isolation is fine, local leftovers are not.** A worktree or local
  branch may hold work in progress; it is merged into the integration branch
  with `git merge` (never rebased or squashed), pushed, and deleted.
- **Pull requests remain for what isn't ours:** Dependabot, outside
  contributors, and `develop` → `main` releases. They merge with a merge
  commit, and the head branch is deleted on merge.

### Commits

- **One author, the repo owner, signed.** Every commit is authored and
  committed by the owner's own git identity (`user.name`, `user.email`, and
  signing key as configured in git). Never a co-author of any kind: no
  `Co-authored-by:` trailer (AI or human), no "Generated with …" line, no AI
  tool as author or committer, no `--author` override. Agents never list
  themselves on a commit or a pull request.
- **Signed and verified.** Every commit is signed and shows **Verified** on
  GitHub; the integration and release branches reject anything else. Signing is
  never bypassed (`--no-gpg-sign`, `-c commit.gpgsign=false`): when it fails,
  stop and fix the signing setup.
- **Meaningful.** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`,
  `refactor:`, `test:`, `perf:`, `build:`, `ci:`, `style:`, `revert:`), with a
  subject that names the change in the imperative
  (`fix(auth): refresh expired tokens before retrying`), never the activity
  (`fix: stuff`, `wip`, `update`, `address review`). One logical change per
  commit, each leaving the build green; the body says why whenever the subject
  can't. Because history is never rewritten, a commit is right before it is
  made: no `fixup!` / `squash!` commits.
- **Merge commits only.** Never squash, rebase, or force-push a shared branch.
  Bring in the remote with `git pull --no-rebase`.

### Finishing work

Work is not finished until it leaves nothing behind:

- everything is committed and **pushed** to the integration branch;
- every worktree created for the work is **removed** (`git worktree remove`);
- every local branch other than the integration and release branches is
  **deleted**;
- `git status` is clean and the branch is level with its remote.

### Everything else

- **Changelog:** every user-facing change adds a line under **Unreleased** in
  `CHANGELOG.md` (or the repo's fragment directory, where it uses one).
- **Secrets:** never committed; `.env` is ignored, `.env.example` documents shape.
- **Writing style:** never use em dashes in prose, commits, or docs; use a
  comma, or reword the sentence, instead.

## Enforcement

The commit rules are checked in three places, so a bad commit is stopped as
early as possible:

1. **Before it exists:** `.githooks/commit-msg` rejects co-author trailers, AI
   attribution, `fixup!` / `squash!` subjects, and subjects that aren't
   Conventional Commits or don't say anything. The scaffolder enables it with
   `git config core.hooksPath .githooks`; every clone runs that once.
2. **When it's pushed:** the integration and release branches carry a ruleset
   that rejects unsigned commits, force pushes, and deletion.
3. **After it's pushed:** the **Commits** job in `.github/workflows/standards.yml`
   re-runs the hook over every pushed or proposed commit and fails on any commit
   GitHub doesn't show as Verified.

## Required repository files

Every repo must carry these. The standards check fails the build when one is
missing:

- **`README.md`**, without it the project cannot be used.
- **`LICENSE`**, without it the project cannot be distributed.
- **`CHANGELOG.md`**, without it the project cannot be released.
- **`CONTRIBUTING.md`**, without it nobody knows how to contribute.
- **`CODE_OF_CONDUCT.md`**, without it contribution has no ground rules.

## GitHub repository settings

Every repo in the `studio51` and `games-directory` organisations is configured
identically. `npx @studio51/create settings` applies the configuration through
the GitHub API, and a daily workflow in the standards repo re-applies it to every
repo in both organisations, so new repos are brought in line within a day and
drift is put back. `.github/settings.yml` mirrors it for the GitHub "Settings" app.

- **Merge commits only:** merge commits allowed; squash merging and rebase
  merging switched off. The default merge commit message is the pull request
  title and body.
- **Automatically delete head branches** after merge.
- **The "Studio51 standard" ruleset** on the default branch and on `develop`,
  `main` and `master`: signed commits required, force pushes blocked, deletion
  blocked. There is deliberately no pull request requirement and no required
  status check, since either would block commits landing directly. Release
  automation that commits to these branches creates its commits through the
  GitHub API, so GitHub signs them.
- **`develop` is the default branch** where it exists.
- **Always suggest updating pull request branches.**
- **Require contributors to sign off on web-based commits.**
- **Allow comments on individual commits** and **auto-close issues** with
  merged linked pull requests (GitHub defaults, kept on).
- **Issues, Discussions, Projects, and Wiki** all enabled.
- **An issue template** present, scaffolded under `.github/ISSUE_TEMPLATE/`.

## Deployment, domains & storage

These apply to everything that runs: Rails, Node, Next.js, workers. A repo that
deploys or stores differently says so in the **This repository** section of its
`AGENTS.md`.

### Railway

Every app is prepared for deployment on [Railway](https://railway.com):

- **`railway.json` at the root** holds the deploy as code: the builder (the
  `Dockerfile` when there is one), the pre-deploy step (migrations), the health
  check path, and the restart policy. Nothing about a deploy lives only in the
  Railway dashboard.
- **Configuration comes from the environment** (Railway variables, plus Rails
  encrypted credentials where the stack has them); `.env.example` documents every
  variable. The app listens on `$PORT`, logs to stdout, and answers a health
  check.
- **No persistent state on the container's disk.** Anything that must survive a
  deploy goes to the database or to R2.
- Kamal and other deploy tooling are not used for new work; a repo still on them
  moves to Railway when it is next touched.

### Cloudflare

Cloudflare runs our domains (DNS), CDN, and storage. Every app is set up to talk
to it through its ecosystem's libraries:

- **Rails:** `cloudflare-rails`, so `request.remote_ip` is the visitor rather than
  Cloudflare's proxy, and `aws-sdk-s3` for R2 through Active Storage.
- **Node / Next.js:** `@aws-sdk/client-s3` for R2, and the official `cloudflare`
  package for the API (DNS, cache purges).
- Public files are served through Cloudflare's CDN on the app's own domain, not
  from the bucket's raw endpoint. API tokens are scoped to the one app and the
  least it needs, and live in the environment.

### R2

When an app needs persistent file storage, it uses Cloudflare R2:

- **Each app has its own bucket**, named after the app, never shared with
  another app. A second bucket for a clearly different purpose is named after
  the app too (`games-directory-cache`).
- **R2 is never a dump.** Studio51 mounts its buckets as a physical drive with
  in-house software, so every file has to be easy to find by browsing. Keys form
  a folder tree that follows the data:

  ```
  <area>/<owner>/<record>/<role>-<suffix>.<ext>

  collectibles/1874/2201/original-8f3a2b91.jpg
  collectibles/1874/2201/enhanced-4c1de770.png
  rocket-league/matches/2026/11/12/<match-id>/replay-1a2b3c4d.replay
  ```

  A plural, kebab-case folder for each area of the app at the top; ids or slugs
  that nest the way the records nest; a filename that says what the file is,
  with a short random suffix so two uploads never overwrite each other, and
  always its extension.
- **Never** a flat key of random characters at the bucket root (Active Storage's
  default), catch-all folders (`uploads/`, `files/`, `misc/`, `tmp/`), or folders
  named after hashes. Deleting a record deletes its folder.
- The reference implementation is `games.directory`'s `BucketFiled` concern,
  which files each Active Storage attachment under its record's folder.

## Currency policy

Studio51 Solutions does **not** maintain older versions of anything. We are a
small team and do not have the resources to guarantee backwards
compatibility, so we stay on the latest secure release and move with it.

### Runtimes

Every repo pins the latest stable release of its runtime and we aim to stay
within two patch/minor releases of upstream at all times. The number lives in
exactly one file (`.ruby-version`, `.python-version`, …) that CI reads; CI never
repeats it. Where the setup action can track "the latest" by itself
(`node-version: lts/*`), it does.

### Dependencies

- **Always the latest secure release** of every gem, package, Swift package,
  and GitHub Action.
- **No version constraints in manifests.** `Gemfile`, `*.gemspec`,
  `package.json`, `Package.swift`, `pyproject.toml` and `requirements.txt` name
  a dependency without pinning or bounding it. Where the ecosystem insists on a
  requirement, use the one its tool writes for the latest release
  (`npm install <pkg>@latest`, SwiftPM `from:` the latest version), never an
  exact pin or an upper bound.
- **The lockfile is the only place an exact version lives** (`Gemfile.lock` for
  applications, `package-lock.json`, `Package.resolved`). It is committed, and
  Dependabot keeps it moving.
- **GitHub Actions use their latest major tag** (`@v7`); the scaffolder resolves
  the latest majors as it writes workflows, so a new repo starts with nothing
  for Dependabot to bump.
- **Dependabot** runs weekly with one grouped pull request per ecosystem,
  titled `chore(deps): …`; security updates arrive individually. Merge them
  promptly, with a merge commit.
- A constraint, or anything held back, needs an issue that justifies it, linked
  in a comment beside the constraint, and is removed as soon as the issue
  closes. The same goes for lowering a runtime pin or a CI version.
