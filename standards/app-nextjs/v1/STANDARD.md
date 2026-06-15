# Studio51 Solutions App (Next.js) Standard · v1

> What a Studio51 Solutions **Next.js** application looks like — the front-end
> flavour of the [App (Rails) Standard](../../app-rails/v1/STANDARD.md), for TypeScript/React
> apps built on Next.js rather than Rails. Extends the
> [Common Standard v1](../../common/v1/STANDARD.md); it never relaxes it.
>
> **Reference implementation:**
> [radulescuvlad.dev](https://github.com/studio51/radulescuvlad.dev) — a static
> Next.js (App Router) + TypeScript site. Studio51's Next.js front-ends (e.g. the
> [games.directory](https://github.com/games-directory/games.directory) web tier)
> follow the same conventions.

## When to use this standard

- Reach for **App (Next.js)** when the deliverable is a Next.js app or site
  (App Router, TypeScript, React) — marketing sites, dashboards, the web tier of
  a product.
- Reach for the **[App (Rails) Standard](../../app-rails/v1/STANDARD.md)** for Rails /
  Hotwire applications.
- A Rails app with a small React island stays on the App (Rails) standard; a Next.js app
  that calls a Rails API stays here. The repo's primary runtime decides.
- The `js-react` stack (`npx @studio51/create --stack js-react`) scaffolds the
  tooling for this standard; `--type app` derives `app-nextjs` automatically.

## Inherits

- **Common Standard v1** in full: repository skeleton, Navigation README, docs
  suite, code-documentation rules, agent files, workflow conventions, runtime
  currency policy.
- **Stack conventions** from the scaffolded `AGENTS.md` (`js-react`): function
  components + hooks, one PascalCase component per file, Prettier + ESLint clean
  before every commit, strict TypeScript for new code.

## Repository skeleton

Everything the Common Standard requires, with these Next.js-specific
expectations:

- **`README.md`** stays minimal — screenshot, title, tagline, description, the
  **Navigation** menu declaring `App (Next.js) Standard v1`, and the license.
  The `.github/workflows/standards.yml` check enforces this.
- **`docs/`** carries all prose, each concern in its own file:
  - `ARCHITECTURE.md` — the framework version, the `app/` route structure, the
    rendering strategy (static / server / client), where data is fetched, and
    the key decisions.
  - `INSTALL.md` — Node version, `npm install`, and the dev commands
    (`npm run dev`, `npm run build`, `npm run lint`).
  - `USAGE.md` — the main user flows and any runtime configuration.
  - Component- or subsystem-level deep dives live under `docs/<area>/`, never at
    the repo root.
- **Agent files** — `AGENTS.md` plus `CLAUDE.md` / `CURSOR.md` / `CODEX.md`
  pointers, with the `js-react` stack section injected.
- **`.github/`** — `ci.yml` (lint + typecheck + build), `standards.yml` (README
  check), `dependabot.yml` (npm ecosystem), issue/PR templates, and `CODEOWNERS`
  pointing at a real user/team. CI workflows trigger on the repo's actual
  default branch.

## Application layout

The App Router is the default. Domain code is organised into focused, top-level
directories so route files stay thin:

- `app/` — routes only: `layout.tsx`, `page.tsx`, `route.ts` handlers,
  `loading`/`error`/`not-found`, plus `sitemap.ts` / `robots.ts` / metadata.
  Route handlers are skinny (parse in, delegate, respond).
- `components/` — reusable UI. One PascalCase component per file; shared
  primitives under `components/ui/`.
- `lib/` — framework-agnostic logic: data access, API clients, helpers, hooks.
- `content/` (or `data/`) — content and copy kept out of components, so the site
  is editable in one place.
- `public/` — static assets.

**Server Components are the default.** Add `"use client"` only at the leaves
that genuinely need interactivity or browser APIs — never on a whole page to
avoid a refactor. Anything reverse-engineered or inferred about an external API
is flagged as such in the code and the docs, with the procedure that confirms it
(per the Common Standard's code-documentation rules).

## TypeScript, lint & formatting

- **Strict TypeScript** for all new code; keep `tsconfig.json` `strict: true`.
  Avoid `any`; prefer precise types and `satisfies`.
- Lint with **ESLint flat config** extending `eslint-config-next`; format with
  **Prettier**. `npm run lint` and `npm run format` must be clean before every
  commit (the `ci.yml` lint job enforces it).
- Path aliases via `@/*` rather than deep relative imports.

## Styling

- A single styling system per repo — **Tailwind CSS** (current major) or CSS
  Modules — not both. Design tokens (colour, type, spacing) live in one place
  (`globals.css` `@theme` / CSS variables or a tokens module), never scattered as
  magic values.
- No unused UI framework left in the bundle; delete what you don't ship.

## Rendering, data & configuration

- **Prefer static.** Default to static generation / Server Components; reach for
  dynamic rendering, route handlers, or client fetching only when the data
  genuinely requires it. Document the choice in `ARCHITECTURE.md`.
- **Configuration is environment-driven.** Secrets and per-environment settings
  come from environment variables; they are never committed. `.env*` is
  git-ignored and `.env.example` documents the shape. Only values that are safe
  in the browser use the `NEXT_PUBLIC_` prefix — assume everything `NEXT_PUBLIC_`
  is public forever.
- Talk to private services from the server (Server Components / route handlers),
  never by shipping a token to the client.

## Runtime currency policy

Per the Common Standard, pin the latest stable runtime and stay current:

- Pin the latest **Node LTS** in `.nvmrc` / `.node-version`, matched by the
  `engines.node` field and the CI Node version.
- Track the latest stable **Next.js** and **React**; commit `package-lock.json`
  (or `pnpm-lock.yaml`) and let Dependabot keep it moving. Version pins and CI
  Node versions are never lowered without an issue justifying the why plus a PR.

## Performance, SEO & accessibility

- **Performance budgets matter.** Use `next/image` and `next/font`, code-split
  client components, and keep the client bundle lean. Aim for excellent
  Lighthouse scores (Performance / Accessibility / Best Practices / SEO ≥ 90).
- **SEO** via the Next.js Metadata API — per-route `metadata`, Open Graph and
  Twitter cards, `sitemap.ts`, `robots.ts`, and JSON-LD where it helps.
- **Accessibility** is not optional: semantic landmarks, labelled controls,
  visible focus states, sufficient contrast, and honour `prefers-reduced-motion`
  for every animation.

## Testing & CI

- `ci.yml` runs **lint → typecheck → build** on every push/PR and must stay
  green on the default branch; add unit/component tests (Vitest / Testing
  Library) and an `e2e` job (Playwright) as the app grows.
- `next build` passing with no type errors is the baseline gate — a build that
  only "works in dev" is not done.
- `standards.yml` enforces the minimal README.
