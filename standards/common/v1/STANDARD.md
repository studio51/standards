# Studio51 Solutions Common Standard · v1

> The baseline every Studio51 Solutions repository adheres to, regardless of
> stack or type. Type-specific standards ([API Gem](../../api-gem/v1/STANDARD.md),
> [App](../../app/v1/STANDARD.md), [Tool](../../tool/v1/STANDARD.md)) extend this
> document; they never relax it.

## How standards are versioned

- Each standard lives in this repo under `standards/<slug>/<version>/STANDARD.md`
  and evolves through versioned directories (`v1`, `v2`, …) on `main`.
- A repo declares the standard it adheres to in its README **Navigation**
  section (see below) and is tracked in the org-wide
  [repository registry](../../../README.md#repository-registry) in the
  standards repo's README.
- A new version is a new directory; published versions are never rewritten,
  only errata-fixed. Repos migrate deliberately, one PR per repo.

## Repository skeleton

Every repo carries the canonical skeleton, scaffolded by `npx @studio51/create`:

- `README.md` — minimal by standard: screenshot, title, tagline/description,
  the **Navigation** menu, and the license. Nothing else; enforced by
  `.github/workflows/standards.yml`.
- `docs/` — all prose: `ARCHITECTURE.md`, `INSTALL.md`, `USAGE.md`, plus any
  type-specific documents. Each concern is documented properly in its own file.
- `LICENSE` + `COPYRIGHT` (and `NOTICE` for Apache-2.0).
- `AGENTS.md` — shared agent/human conventions, plus pointer files `CLAUDE.md`,
  `CURSOR.md`, and `CODEX.md` (see **Agent instructions** below).
- `.github/` — issue/PR templates, `CODEOWNERS` (a real GitHub user/team),
  dependabot, CI, and the standards check.
- Hygiene: `.editorconfig`, `.gitattributes`, `CHANGELOG.md`, `SECURITY.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.

## README Navigation

The README's docs menu is titled **Navigation**. Directly under the heading it
states which standard the repo adheres to, then links each documented section:

```markdown
## Navigation

This repository adheres to the [Studio51 Solutions API Gem Standard v1](…),
with each section documented properly in its own file.

- [Architecture](docs/ARCHITECTURE.md)
- [Install & setup](docs/INSTALL.md)
- [Usage](docs/USAGE.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
```

## Code documentation

Comments are part of the standard — required, not optional:

- Document **every public method, class, module, and constant** with a comment
  block directly above it: a short sentence on what it is/does, then each
  parameter and the return value.
- Separate prose from parameter/return tags with one blank comment line; keep a
  blank comment line as the last line of a class/module doc block.
- One sentence per line — don't hard-wrap a sentence.
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
  go into that agent's file.

## Workflow conventions

These rules apply to agents and humans alike.

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, …).
  Commits must be **verified** (signed); `main` rejects unverified commits.
- **Branches:** `feature/…`, `fix/…`, `chore/…`. Never commit to `main`
  directly; every change lands through a pull request, however small.
- **Pull requests:** one PR does one thing (keep them atomic), carries a clear
  description of what changed and why, and includes a `CHANGELOG.md` entry for
  any user-facing change.
- **Changelog:** every user-facing change adds a line under **Unreleased**.
- **Secrets:** never committed; `.env` is ignored, `.env.example` documents shape.
- **Authorship:** never an AI tool as git author or co-author, never an AI
  `Co-Authored-By` trailer. Agents never list themselves on a commit.
- **Writing style:** never use em dashes in prose, commits, or docs; use a
  comma, or reword the sentence, instead.

## Required repository files

Every repo must carry these. The standards check fails the build when one is
missing:

- **`README.md`**, without it the project cannot be used.
- **`LICENSE`**, without it the project cannot be distributed.
- **`CHANGELOG.md`**, without it the project cannot be released.
- **`CONTRIBUTING.md`**, without it nobody knows how to contribute.
- **`CODE_OF_CONDUCT.md`**, without it contribution has no ground rules.

Verified commits are required alongside them: `main` refuses to merge
unverified commits.

## GitHub repository settings

Every repo in the `studio51` and `games-directory` organisations is configured
identically, so the contribution flow is the same everywhere. The declarative
source is `.github/settings.yml` (applied by the GitHub "Settings" app);
anything the app cannot set yet is noted there and applied as a repository
ruleset by hand.

Required configuration:

- **Verified commits** on `main`, enforced by a ruleset; unverified commits
  cannot be merged.
- **Require a pull request before merging**, with pull requests restricted to
  collaborators.
- **Merge commits allowed**, with the default merge commit message set to the
  pull request title.
- **Always suggest updating pull request branches.**
- **Automatically delete head branches** after merge.
- **Require contributors to sign off on web-based commits.**
- **Allow comments on individual commits.**
- **Auto-close issues** with merged linked pull requests.
- **Issues, Discussions, Projects, and Wiki** all enabled.
- **An issue template** present, scaffolded under `.github/ISSUE_TEMPLATE/`.

## Runtime currency policy

Studio51 Solutions does **not** maintain older runtime versions. Every repo
pins the latest stable release of its runtime (e.g. Ruby 4.0.5) and we aim to
stay within two patch/minor releases of upstream at all times. We are a small
team and do not have the resources to guarantee backwards compatibility.

Anyone interested in introducing or supporting an older version must open an
issue justifying the *why*, together with a PR — without that, version pins,
CI matrices, and `required_*_version` constraints are never lowered.
