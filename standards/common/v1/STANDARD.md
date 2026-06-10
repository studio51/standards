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

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, …).
- **Branches:** `feature/…`, `fix/…`, `chore/…`; PRs into `main`.
- **Changelog:** every user-facing change adds a line under **Unreleased**.
- **Secrets:** never committed; `.env` is ignored, `.env.example` documents shape.
- **Authorship:** never an AI tool as git author, never an AI `Co-Authored-By` trailer.

## Runtime currency policy

Studio51 Solutions does **not** maintain older runtime versions. Every repo
pins the latest stable release of its runtime (e.g. Ruby 4.0.5) and we aim to
stay within two patch/minor releases of upstream at all times. We are a small
team and do not have the resources to guarantee backwards compatibility.

Anyone interested in introducing or supporting an older version must open an
issue justifying the *why*, together with a PR — without that, version pins,
CI matrices, and `required_*_version` constraints are never lowered.
