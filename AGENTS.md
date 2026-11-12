# AGENTS.md: Studio51 Solutions Standards

Instructions for AI coding agents (Claude Code and friends) working in **this**
repo, the one that defines the standards. Generated repos get their own
`AGENTS.md` from `templates/common/AGENTS.md.tmpl`.

## What this repo is

The canonical templates + CLI that scaffold standard files into every other
Studio51 Solutions repo. Changing a file here changes the standard for all 
future repos.

The standards themselves are versioned documents under
`standards/<slug>/<version>/STANDARD.md` (common, api-gem, app-rails, tool); the
[README](README.md) indexes them under **Navigation** and carries the
org-wide repository registry, which exists **only** in this repo.

## Golden rules

- **Templates are not finished files.** Files under `templates/` contain
  `{{TOKEN}}` placeholders and `{{#if …}}` conditionals; leave them in place.
  Never hard-code `Studio51 Solutions`, a year, or a project name into a template;
  use the token. See [TOKENS.md](TOKENS.md).
- **`common/` must stay stack-agnostic.** Anything Ruby/JS/Docker-specific lives
  in a `stacks/` overlay, never in `common/`.
- **Keep the README skeleton stable.** The section order in
  `templates/common/README.md.tmpl` is the product. Add optional sections as
  commented stubs rather than reordering.
- **One fact, one place.** Org details live only in `studio51.config.json`,
  including the current version per standard (the `standards` map).
- **Published standard versions are immutable.** Evolving a standard means a
  new `standards/<slug>/v<n+1>/` directory, never rewriting the old one
  (errata fixes excepted). Bump the version in `studio51.config.json` when the
  new version becomes current.
- **Keep the registry honest.** Any repo created, migrated, or archived in the
  `studio51` / `games-directory` orgs gets its row updated in the
  [README](README.md) repository registry.
- **Ruby is always the latest stable (currently 4.0.9).** Studio51 does not
  maintain older Rubies (we stay within ~2 patch/minor releases of upstream);
  the number lives only in the stack templates' `.ruby-version` /
  `.tool-versions`, and CI reads it from there. Never lower a pin or
  `required_ruby_version` without the issue that justifies it.

## Conventions (the Studio51 standard, mirrored into generated repos)

These follow the [Common Standard v2](standards/common/v2/STANDARD.md).

- **Commit straight to `main`.** No pull request and no pushed feature branch;
  a local worktree or branch is merged in with `git merge` (never rebased or
  squashed), pushed, and deleted.
- **One author: the owner, signed.** Commit with the configured git identity and
  signing key. Never a co-author of any kind: no `Co-authored-by:` trailer, no
  "Generated with …" line, no AI tool as author, no `--author`, and never
  `--no-gpg-sign`.
- **Meaningful Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`…): one
  logical change each, a subject that names the change, a body that says why.
- **Merge commits only;** never squash, rebase, or force-push.
- Update `CHANGELOG.md` under **Unreleased** for any user-facing change.
- Never commit secrets. Never use em dashes; use a comma, or reword, instead.

## Before you finish

- [ ] Tokens left intact in templates (no hard-coded org/year/name)
- [ ] `common/` stayed stack-agnostic
- [ ] If you added a token, it's documented in `TOKENS.md`
- [ ] If you added a template file, the CLI copy/merge logic accounts for it
- [ ] `templates/common/.github/settings.yml` and `cli/lib/settings.js` still agree
- [ ] Every commit signed by the owner, with no co-author or AI attribution
- [ ] Everything pushed to `main`; worktrees removed, local branches deleted,
      `git status` clean
