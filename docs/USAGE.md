# Usage

`@studio51/create` has three modes.

## create (default)

Scaffolds the standard files into a repo, skipping any that already exist (pass
`--force` to overwrite). Use this to bring a new or existing repo up to standard,
including the `docs/` stubs and the `.github/` meta.

While it writes workflows it looks up each GitHub Action's latest release and
raises the pin to that major, so a new repo starts with nothing for Dependabot
to bump (`--offline` skips the lookup). In a git repo it also enables the
`commit-msg` hook with `git config core.hooksPath .githooks`, unless the repo
already uses another hooks directory. An existing `.claude/settings.json` is
merged, never replaced.

```bash
npx @studio51/create --name <name> --type <type> --stack <stack> --license <license>
```

## update

Re-syncs only the managed meta files (LICENSE, COPYRIGHT, AGENTS.md and the agent
pointer files, `.github/`, `.githooks/commit-msg`, `.claude/settings.json`,
`.editorconfig`, `.gitattributes`, CODE_OF_CONDUCT, SECURITY, CONTRIBUTING) to the
latest standard. It never touches project content like `README.md`, `docs/`, or
`CHANGELOG.md`.

It renders them from the repo's own choices, recorded in `.studio51.json`
(name, title, type, stack, add-ons, license, visibility, standard), which
`create` writes and `update` reads. A repo scaffolded before the manifest
existed gets one inferred from its README (the standard it declares),
`AGENTS.md` (type, description), `LICENSE` and files. Flags still win.

CI workflows and `.github/dependabot.yml` belong to the repo once they exist:
`update` never replaces them. It raises their action pins to the latest
majors, widens a `main`-only push trigger to `develop`, `main` and `master`, and
gives each Dependabot ecosystem the standard's grouping and commit prefix,
keeping the repo's directories and settings. `.vscode/*.json` is merged like
`.claude/settings.json`. In the README, only the sentence declaring the
standard moves to the current version.

Repo-specific lines survive in the files the standard shares: `.gitattributes`
keeps the repo's own attributes after the standard's, `.editorconfig` keeps any
section the repo added, and a `LICENSE` or `COPYRIGHT` naming another copyright
holder (a fork's upstream author) is left alone. `SECURITY.md` is the repo's
after it is scaffolded. Checks a repo adds for itself belong in a workflow of
its own, not in the managed `standards.yml`.

Repo-owned text survives: the **This repository** section of `AGENTS.md` and
everything below the marker line in `CLAUDE.md` / `CURSOR.md` / `CODEX.md` are
carried across unchanged. An older `AGENTS.md` without a **This repository**
section is skipped; move its repo-specific text into one, or pass `--force` to
replace it.

```bash
npx @studio51/create update
```

## settings

Applies the standard GitHub repository settings through the GitHub API, using
the `gh` CLI (repo admin required): merge commits only (squash and rebase
off), head branches deleted on merge, and the **Studio51 standard** ruleset
(signed commits, no force pushes, no deletion) on the default branch and
`develop`, `main` and `master`. It notes any other ruleset on the repo, and a
`develop` branch that isn't the default. Re-running it is safe.

```bash
npx @studio51/create settings --dry-run   # show what would change
npx @studio51/create settings             # the repo behind the current directory
npx @studio51/create settings --repo games-directory/api.halo
```

## Options

| Flag | Meaning |
| --- | --- |
| `--name` | project / repo name (default: detected) |
| `--type` | library, app, plugin, tool, service |
| `--stack` | js-vanilla, js-react, rails, rails-hotwire, ruby-gem, python, swift (default: detected) |
| `--addons` | comma-separated, e.g. `docker` |
| `--license` | MIT, Apache-2.0, Proprietary |
| `--visibility` | public, private |
| `--dir` | target directory (default: current) |
| `--force` | overwrite existing files (create mode); replace an `AGENTS.md` without a **This repository** section (update mode) |
| `--dry-run` | show what would be written or changed, change nothing |
| `--offline` | keep the templates' action versions instead of looking up the latest |
| `--repo` | `settings`: the `owner/name` to configure (default: the target's git remote) |
| `--yes`, `-y` | accept detected / default answers |

## Stacks

`js-vanilla`, `js-react`, `rails`, `rails-hotwire`, `ruby-gem`, `python`, `swift`,
plus the `docker` and `demo` add-ons. The stack auto-detects from the target repo's files; override it
with `--stack`.
