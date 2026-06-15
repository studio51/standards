# Studio51 Solutions App (Rails) Standard · v1

> What a Studio51 Solutions Rails application looks like.
> Extends the [Common Standard v1](../../common/v1/STANDARD.md); it never
> relaxes it.
>
> **Reference implementation:**
> [games.directory](https://github.com/games-directory/games.directory) — a
> Rails 7.2 / Hotwire app. It was the first repo migrated onto this standard and
> shaped the conventions below.

## Inherits

- **Common Standard v1** in full: repository skeleton, Navigation README, docs
  suite, code-documentation rules, agent files, workflow conventions, runtime
  currency policy.
- **Stack conventions** from the scaffolded `AGENTS.md` (`rails` /
  `rails-hotwire`): skinny controllers, domain logic in models/services, a
  committed `Gemfile.lock`, HTML over the wire with Turbo + Stimulus.

## Repository skeleton

Everything the Common Standard requires, with these app-specific expectations:

- **`README.md`** stays minimal — screenshot, title, tagline, description, the
  **Navigation** menu declaring `App (Rails) Standard v1`, and the license. The
  `.github/workflows/standards.yml` check enforces this.
- **`docs/`** carries all prose, each concern in its own file:
  - `ARCHITECTURE.md` — the stack, the `app/` layout, and the key decisions
    (why this app exists, how external data is normalised, where background work
    runs).
  - `INSTALL.md` — requirements, quick start, and the development commands
    (`bin/dev`, `bundle exec rake`, `bundle exec rubocop`).
  - `USAGE.md` — the main user workflows and runtime configuration.
  - Component- or subsystem-level deep dives live under `docs/<area>/` (e.g.
    `docs/components/`), never at the repo root.
- **Agent files** — `AGENTS.md` plus `CLAUDE.md` / `CURSOR.md` / `CODEX.md`
  pointers, with the `rails` and (where applicable) `rails-hotwire` stack
  sections injected.
- **`.github/`** — `ci.yml` (lint + test), `standards.yml` (README check),
  `dependabot.yml`, issue/PR templates, and `CODEOWNERS` pointing at a real
  user/team. CI workflows trigger on the repo's default branch — use the actual
  default (`develop`, `main`, …), not a hardcoded `main`.

## Application layout

Domain logic is organised into focused layers under `app/`. Beyond the Rails
defaults (`controllers`, `models`, `views`, `helpers`, `jobs`, `mailers`,
`channels`), an app on this standard uses dedicated directories so controllers
and models stay thin:

- `services/` — orchestration and business operations.
- `integrations/` — clients/adapters for external APIs.
- `transformers/` — normalise external payloads into the app's internal shape.
- `entities/` / `schemas/` — value objects and payload schemas.
- `decorators/` — presentation logic over models.
- `components/` — ViewComponent classes and templates.
- `policies/` — authorization rules.
- `notifiers/` — outbound notifications.

Controllers are skinny (HTTP in, delegate, render). Domain logic lives in
models and services. Anything reverse-engineered or inferred about an external
API is flagged as such in the code and the docs, with the procedure that
confirms it (per the Common Standard's code-documentation rules).

## Ruby & RuboCop

- Pin the latest stable Ruby in `.ruby-version` / `.tool-versions` (runtime
  currency policy). The reference app is on **Ruby 4.0.5**.
- Lint with the `rails` stack `.rubocop.yml` (Omakase + Performance). **RuboCop
  must be `>= 1.80` to target Ruby 4.0** — older releases crash on the 4.0
  parser. Pin that floor in the Gemfile's `:development` group; never lower it.
- `bundle exec rubocop` must be clean. Adopting the standard on an existing
  codebase is a one-time `bundle exec rubocop -A` reformat, committed on its own.

## Deployment & environment configuration

- **Configuration is environment-driven.** Secrets and per-environment settings
  come from environment variables and Rails encrypted credentials
  (`bin/rails credentials:edit`); they are never committed. `.env` is git-ignored
  and `.env.example` documents the shape.
- **Deployment** uses [Kamal](https://kamal-deploy.org/) (the `.kamal/`
  directory and `Dockerfile` are part of the repo). Container builds honour the
  `docker` stack hygiene (`.dockerignore`).

## Background jobs, storage & observability

- **Background jobs** run on Sidekiq (Redis-backed). Split workloads across
  named queues by weight rather than overloading the default — the reference app
  runs a `regular` queue and a heavier `splash` queue, each with its own
  `config/sidekiq.*.yml` and `Procfile` entry.
- **File storage** uses ActiveStorage; production blobs go to object storage
  (e.g. S3). The `storage/` directory is git-ignored except its `.keep`.
- **Error and performance monitoring** uses Sentry (`sentry-ruby` /
  `sentry-rails`). Wire the DSN through environment configuration, not the repo.

## Testing & CI

- Tests run with `bundle exec rake` (the CI `test` job). Keep the suite green on
  the default branch.
- `ci.yml` runs `bundle exec rubocop` then `bundle exec rake`; `standards.yml`
  enforces the minimal README. Add `bin/brakeman` for a static security pass.
