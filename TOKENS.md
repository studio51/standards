# Tokens

Every template file in `templates/` may contain `{{TOKEN}}` placeholders. The
scaffolding CLI (and a plain find/replace, if you prefer manual setup) swaps
them for real values. Tokens use double curly braces and `SCREAMING_SNAKE_CASE`.

## Resolution order

A token's value is resolved from the first source that provides it:

1. **CLI prompt / flag**: answers given at scaffold time (`--name`, `--license`, …)
2. **Auto-detection**: inferred from the target repo (gemspec → `rails`, `package.json` → `js-*`, repo privacy → license default)
3. **`studio51.config.json`**: org-wide defaults
4. **Computed**: derived values (e.g. `YEAR`, `YEAR_RANGE`)

## Token reference

| Token | Source | Example |
|---|---|---|
| `{{PROJECT_NAME}}` | prompt / repo dir | `orbit` |
| `{{PROJECT_TITLE}}` | prompt (Title Case of name) | `Orbit` |
| `{{TAGLINE}}` | prompt | `A drop-in, dependency-free 3D activity globe.` |
| `{{DESCRIPTION}}` | prompt | `A real-time, interactive 3D globe…` |
| `{{TYPE}}` | prompt | `plugin` |
| `{{STACK}}` | detect / prompt | `js-vanilla` |
| `{{STACK_LABEL}}` | derived | `Vanilla JS · Canvas 2D · SVG` |
| `{{LICENSE}}` | prompt / default | `Proprietary` |
| `{{VISIBILITY}}` | detect / prompt | `private` |
| `{{ORG}}` | config | `studio51` |
| `{{ORG_URL}}` | config | `https://github.com/studio51` |
| `{{REPO_URL}}` | derived | `https://github.com/studio51/orbit` |
| `{{LEGAL_NAME}}` | config | `Studio51 Solutions` |
| `{{AUTHOR}}` | config | `Vlad Radulescu` |
| `{{EMAIL}}` | config | `vlad@studio51.solutions` |
| `{{WEBSITE}}` | config | `https://studio51.solutions` |
| `{{SECURITY_CONTACT}}` | config | `security@studio51.solutions` |
| `{{YEAR}}` | computed | `2026` |
| `{{YEAR_RANGE}}` | computed / existing | `2014 – 2026` |

`{{YEAR_RANGE}}` preserves an existing repo's original copyright year when
re-syncing (e.g. fluent-icons keeps `2023 – 2026`); for a brand-new repo it is
just `{{YEAR}}`.

## Conditionals

Templates support a tiny line-level conditional so one file serves every variant
without a templating-engine dependency:

```
{{#if LICENSE == MIT}}
Licensed under the MIT License. See LICENSE.
{{/if}}
{{#if VISIBILITY == public}}
[![CI](...badge...)](...)
{{/if}}
```

Rules: one condition per block, `==` or `!=` only, no nesting. Anything the CLI
can't evaluate is left untouched so the template stays readable.
