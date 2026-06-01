# Architecture

> How the standards repo is organised and how scaffolding works.

## What's in here

```
standards/
├── studio51.config.json    # org-wide defaults (name, author, email, licenses, stacks)
├── schema/                 # JSON Schema for studio51.config.json
├── TOKENS.md               # the {{TOKEN}} system used by every template
├── templates/
│   ├── common/             # stack-agnostic files (always applied), incl. README + docs/
│   ├── licenses/           # MIT, Apache-2.0, Proprietary
│   └── stacks/             # js-vanilla, js-react, rails, rails-hotwire, ruby-gem, python, docker
└── cli/                    # the Node scaffolder (npx @studio51/create)
```

## How generation works

`common/` is always applied, then the chosen stack overlay(s) are layered on top
(a stack may extend another, e.g. `rails-hotwire` extends `rails`), then every
`{{TOKEN}}` is replaced from your answers plus `studio51.config.json`. See
[TOKENS.md](../TOKENS.md).

## The canonical structure

Every Studio51 repo ends up with the same skeleton, so any of us (and any agent)
can open any repo and know exactly where things live:

- **README.md**: minimal by standard. Screenshot, title, description, a docs menu,
  and the license, nothing else. Enforced by `.github/workflows/standards.yml`.
- **docs/**: `ARCHITECTURE.md`, `INSTALL.md`, `USAGE.md` carry the detail. All the
  prose the README used to hold lives here.
- **LICENSE** + **COPYRIGHT**: chosen per repo (MIT / Apache-2.0 / Proprietary).
- **AGENTS.md**: identical conventions block plus a stack-specific section.
- **.github/**: issue/PR templates, CODEOWNERS, dependabot, CI, and the standards check.
- **Hygiene**: `.editorconfig`, `.gitattributes`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`.

## Key decisions

- **`common/` is always applied; stacks layer on top.** Detection picks the stack,
  but it is only advisory: the user confirms before anything is written.
- **`update` is content-safe.** It re-syncs only managed meta files and never
  touches `README.md`, `docs/`, or `CHANGELOG.md`, so project prose is never lost.
- **The README is enforced, not just suggested.** A standards CI check fails the
  build if the README grows any section beyond `Docs` and `License`.
