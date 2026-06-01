# Usage

`@studio51/create` has two modes.

## create (default)

Scaffolds the standard files into a repo, skipping any that already exist (pass
`--force` to overwrite). Use this to bring a new or existing repo up to standard,
including the `docs/` stubs and the `.github/` meta.

```bash
npx @studio51/create --name <name> --type <type> --stack <stack> --license <license>
```

## update

Re-syncs only the managed meta files (LICENSE, COPYRIGHT, AGENTS.md, `.github/`,
`.editorconfig`, `.gitattributes`, CODE_OF_CONDUCT, SECURITY, CONTRIBUTING) to the
latest standard. It never touches project content like `README.md`, `docs/`, or
`CHANGELOG.md`.

```bash
npx @studio51/create update
```

## Options

| Flag | Meaning |
| --- | --- |
| `--name` | project / repo name (default: detected) |
| `--type` | library, app, plugin, tool, service |
| `--stack` | js-vanilla, js-react, rails, rails-hotwire, ruby-gem, python (default: detected) |
| `--addons` | comma-separated, e.g. `docker` |
| `--license` | MIT, Apache-2.0, Proprietary |
| `--visibility` | public, private |
| `--dir` | target directory (default: current) |
| `--force` | overwrite existing files (create mode) |
| `--dry-run` | show what would be written, write nothing |
| `--yes`, `-y` | accept detected / default answers |

## Stacks

`js-vanilla`, `js-react`, `rails`, `rails-hotwire`, `ruby-gem`, `python`, plus the
`docker` add-on. The stack auto-detects from the target repo's files; override it
with `--stack`.
