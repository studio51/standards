# AGENTS.md: Studio51 Solutions Standards

Instructions for AI coding agents (Claude Code and friends) working in **this**
repo, the one that defines the standards. Generated repos get their own
`AGENTS.md` from `templates/common/AGENTS.md.tmpl`.

## What this repo is

The canonical templates + CLI that scaffold standard files into every other
Studio51 Solutions repo. Changing a file here changes the standard for all 
future repos.

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
- **One fact, one place.** Org details live only in `studio51.config.json`.

## Conventions (the Studio51 standard, mirrored into generated repos)

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…).
- Branches: `feature/…`, `fix/…`, `chore/…`.
- Update `CHANGELOG.md` under **Unreleased** for any user-facing change.
- Never commit secrets. Never commit an AI tool as the git author.

## Before you finish

- [ ] Tokens left intact in templates (no hard-coded org/year/name)
- [ ] `common/` stayed stack-agnostic
- [ ] If you added a token, it's documented in `TOKENS.md`
- [ ] If you added a template file, the CLI copy/merge logic accounts for it
