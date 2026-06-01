# Studio51 Standards

> The single source of truth for how every Studio51 repository is structured,
> licensed, and documented.

Stop reinventing the README. This repo holds the canonical `README`, `LICENSE`,
`COPYRIGHT`, `AGENTS.md`, GitHub meta files, and per-stack configs that every
Studio51 project should share, plus a zero-install CLI that scaffolds them into
a new (or existing) repo in one command.

## At a glance

| | |
|---|---|
| **Type**    | Tooling / templates |
| **Stack**   | Node CLI + template files |
| **License** | Proprietary, © 2026 Studio51 Solutions |
| **Status**  | Active (bootstrapping) |

## Quick start

Scaffold the standard files into a repo:

```bash
cd my-new-project
npx @studio51/create          # interactive
# or, non-interactive:
npx @studio51/create --name orbit --type plugin --stack js-vanilla --license Proprietary
```

Re-sync the standard files into an existing repo (won't clobber your custom content):

```bash
npx @studio51/create update
```

## What's in here

```
standards/
├── studio51.config.json    # org-wide defaults (name, author, email, licenses…)
├── TOKENS.md               # the {{TOKEN}} system used by every template
├── templates/
│   ├── common/             # stack-agnostic files (always applied)
│   ├── licenses/           # MIT · Apache-2.0 · Proprietary
│   └── stacks/             # js-vanilla · js-react · rails · rails-hotwire · ruby-gem · python · docker
└── cli/                    # the Node scaffolder (npx @studio51/create)
```

How generation works: **`common/` is always applied**, then the chosen
**stack overlay(s)** are layered on top, then every `{{TOKEN}}` is replaced from
your answers + `studio51.config.json`. See [TOKENS.md](TOKENS.md).

## The canonical structure

Every Studio51 repo ends up with the same skeleton, so any of us (and any AI
agent) can open any repo and know exactly where things live:

- **README.md**: same section order everywhere, opening with an *At a glance* table.
- **LICENSE** + **COPYRIGHT**: chosen per repo (MIT / Apache-2.0 / Proprietary).
- **AGENTS.md**: identical conventions block + a stack-specific section.
- **.github/**: issue/PR templates, CODEOWNERS, dependabot, CI (lighter for private repos).
- **Hygiene**: `.editorconfig`, `.gitattributes`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`.

## License

Proprietary, © 2026 Studio51 Solutions. Internal tooling for Studio51 projects.

## About

Built and maintained by [Studio51](https://github.com/studio51).
