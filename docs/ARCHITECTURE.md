# Architecture

> How the standards repo is organised and how scaffolding works.

## What's in here

```
standards/
├── STANDARD.md             # index of versioned standards + org-wide repository registry
├── standards/              # the versioned standards themselves
│   └── <slug>/<version>/STANDARD.md   # common, api-gem, app, tool — v1, v2, …
├── studio51.config.json    # org-wide defaults (name, author, email, standards, licenses, stacks)
├── schema/                 # JSON Schema for studio51.config.json
├── TOKENS.md               # the {{TOKEN}} system used by every template
├── templates/
│   ├── common/             # stack-agnostic files (always applied), incl. README + docs/
│   ├── licenses/           # MIT, Apache-2.0, Proprietary
│   └── stacks/             # js-vanilla, js-react, rails, rails-hotwire, ruby-gem, python, docker
└── cli/                    # the Node scaffolder (npx @studio51/create)
```

## Versioned standards

Each standard (Common, API Gem, App, Tool, …) lives under
`standards/<slug>/<version>/STANDARD.md` and evolves through versioned
directories on `main`: a new version is a new directory, published versions
are only errata-fixed, and repos migrate deliberately. The current version per
slug lives in `studio51.config.json` (`standards` map) and feeds the
`{{STANDARD_*}}` tokens. [STANDARD.md](../STANDARD.md) indexes the standards
and carries the org-wide registry of which repo adheres to which version —
that registry exists only in this repo.

## How generation works

`common/` is always applied, then the chosen stack overlay(s) are layered on top
(a stack may extend another, e.g. `rails-hotwire` extends `rails`), then every
`{{TOKEN}}` is replaced from your answers plus `studio51.config.json`. See
[TOKENS.md](../TOKENS.md).

## The canonical structure

Every Studio51 repo ends up with the same skeleton, so any of us (and any agent)
can open any repo and know exactly where things live:

- **README.md**: minimal by standard. Screenshot, title, description, the
  **Navigation** menu (which declares the standard + version the repo adheres
  to), and the license, nothing else. Enforced by `.github/workflows/standards.yml`.
- **docs/**: `ARCHITECTURE.md`, `INSTALL.md`, `USAGE.md` carry the detail. All the
  prose the README used to hold lives here, each section in its own file.
- **LICENSE** + **COPYRIGHT**: chosen per repo (MIT / Apache-2.0 / Proprietary).
- **AGENTS.md**: identical conventions block plus a stack-specific section.
  `CLAUDE.md`, `CURSOR.md`, and `CODEX.md` are thin pointers that direct each
  agent to adhere to `AGENTS.md`; only agent-specific instructions live in them.
- **.github/**: issue/PR templates, CODEOWNERS, dependabot, CI, and the standards check.
- **Hygiene**: `.editorconfig`, `.gitattributes`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`.

## Key decisions

- **`common/` is always applied; stacks layer on top.** Detection picks the stack,
  but it is only advisory: the user confirms before anything is written.
- **`update` is content-safe.** It re-syncs only managed meta files and never
  touches `README.md`, `docs/`, or `CHANGELOG.md`, so project prose is never lost.
- **The README is enforced, not just suggested.** A standards CI check fails the
  build if the README grows any section beyond `Navigation` and `License`.
