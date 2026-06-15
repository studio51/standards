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
org-wide repository registry — which exists **only** in this repo.

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
- **Ruby is always the latest stable (currently 4.0.5).** Studio51 does not
  maintain older Rubies (we stay within ~2 patch/minor releases of upstream);
  never lower a pin, CI matrix, or `required_ruby_version` without the
  issue + PR that justifies it.

## Conventions (the Studio51 standard, mirrored into generated repos)

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…); commits verified.
- Branches: `feature/…`, `fix/…`, `chore/…`. Never commit to `main`; open a PR
  for every change, however small.
- Pull requests are atomic (one thing each) with a clear description.
- Update `CHANGELOG.md` under **Unreleased** for any user-facing change.
- Never commit secrets. Never set an AI tool as the git author or co-author.
- Never use em dashes; use a comma, or reword, instead.

## Before you finish

- [ ] Tokens left intact in templates (no hard-coded org/year/name)
- [ ] `common/` stayed stack-agnostic
- [ ] If you added a token, it's documented in `TOKENS.md`
- [ ] If you added a template file, the CLI copy/merge logic accounts for it
