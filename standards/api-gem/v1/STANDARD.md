# Studio51 Solutions API Gem Standard · v1

> What a Studio51 Solutions API client gem looks like. Extends the
> [Common Standard v1](../../common/v1/STANDARD.md) and the `ruby-gem` stack
> conventions; it never relaxes them.
>
> **Reference implementation:**
> [`games-directory/api-playgoals`](https://github.com/games-directory/api-playgoals).
> When this document and the reference disagree, fix one of them — never let
> them drift silently.

## Naming & namespace

- Repo name: `api-<service>` (e.g. `api-playgoals`, `api-steam`).
- Gem name matches the repo; namespace is `Api::<Service>` with a thin
  entrypoint at `lib/api/<service>.rb` that requires the rest. Everything else
  lives under `lib/api/<service>/`.

## Dependencies

- **Stdlib-first.** Prefer zero runtime dependencies (`net/http`, `json`,
  `uri`); every runtime dependency added needs a justification in
  `docs/ARCHITECTURE.md`.
- Development dependencies follow the scaffolded gemspec: minitest/rspec,
  rake, `rubocop-rails-omakase`, `rubocop-performance`, `rubocop-studio51`.

## Structure

The reference shape — adapt names to the API, keep the roles:

```
lib/api/<service>.rb          # entrypoint: requires + convenience constructors
lib/api/<service>/
  version.rb                  # VERSION (+ provenance constants where relevant)
  configuration.rb            # base URLs, credentials, timeouts, headers, logger
  client.rb                   # the one public entry object; bundles the services
  errors.rb                   # typed error hierarchy + upstream-code mapping
  <transport>.rb              # protocol transport, isolated from the bindings
  <service binding>.rb        # one file per upstream service/resource group
spec/                         # offline tests — network always stubbed/injected
```

## Client design

- **One public entry object** (`Client`), configured via a block or keyword
  arguments backed by a `Configuration` object with sensible defaults
  (timeouts, base URLs, `user_agent`, `default_headers`, `raise_on_error`,
  `logger`).
- **Typed errors.** Non-2xx responses raise a subclass of the gem's `Error`
  keyed on the upstream's canonical code; upstream application codes are
  exposed on the error (e.g. `#app_code`), never swallowed.
- **Transport isolation.** Protocol mechanics (HTTP, retries, keep-alive,
  encoding) live in one transport class; service bindings stay declarative.
- **Discoverable surface.** The full method catalogue is reachable at runtime
  (e.g. a `rpc_catalog` / method registry) and mirrored in `docs/USAGE.md`.
- **Secrets are redacted everywhere.** Objects holding credentials override
  `#inspect`; logger hooks receive credential-bearing fields as `[REDACTED]`.

## Authentication

Every API authenticates differently, so this standard prescribes *how auth is
handled and documented*, not which scheme to use:

- Credentials enter via constructor/ENV, never hard-coded; `.env.example`
  documents the variables.
- `docs/USAGE.md` explains, in one picture/table, what the caller supplies,
  what the gem does with it, and where the credential comes from —
  including the manual bootstrap path when there is one.
- Token/credential holders expose what consumers need to persist (e.g.
  `refresh_token`, `expires_at`) and support a refresh callback where rotation
  exists.
- Unverified or reverse-engineered auth flows are clearly flagged as such, with
  the probe/procedure that can confirm them.

## games.directory integration

Where applicable, an API gem supports the games.directory multi-user case:
per-user provider logins (Xbox / PSN / Steam / Epic via the existing
`*-oauth` gems) exchanged for the service's credentials, with a persistence
hook so games.directory can store rotated tokens per user. Document the
exchange flow in `docs/USAGE.md`; if the service has no such concept, state
that explicitly in `docs/ARCHITECTURE.md`.

## Documentation suite

The README stays minimal (Common Standard). The docs carry the depth:

- `docs/ARCHITECTURE.md` — what the gem is, how it talks to the service, the
  structure tree, and **key decisions**. Where anything was reverse-engineered,
  the full provenance: source artifact, version, what was and wasn't
  recoverable.
- `docs/INSTALL.md` — requirements (Ruby pin, dependency posture), Gemfile
  snippet, quick start, development setup (`bin/setup`, `bin/console`, rake,
  rubocop).
- `docs/USAGE.md` — the public API end-to-end: auth in one picture,
  copy-pasteable examples, error handling, the configuration table
  (option / default / meaning), and the full API surface catalogue.
- `docs/SCHEMA.md` — inferred per-endpoint request/response schemas for the
  **read-only** surface, with a "how to read this" key and an explicit
  out-of-scope list for mutating endpoints.
- `docs/examples/` — real captured payloads, one file per read-only helper,
  named after the snake_case method. The examples README states capture date
  and channel, truncation rules (show the shape, not the payload), and
  redaction rules (PII and tokens become `<redacted>`; throwaway accounts
  only).

Captured examples are the contract: they prove the wire shape and back the
offline tests. Generated clients are not exempt.

## Code documentation

The Common Standard's comment rules apply with YARD syntax: every public
method gets prose plus a `@param` per argument, a `@return`, and `@yieldparam`
when it yields — including `initialize`. Lint is the source of truth:
`bundle exec rubocop` (omakase + `rubocop-performance` + the `rubocop-studio51`
house cops, via the scaffolded `.rubocop.yml`) must be clean.

## Testing

- The suite runs **fully offline** — the transport is injectable/stubbed; no
  test ever touches the live API.
- Read-only endpoints are covered against the captured examples; security
  behaviours (redaction, error mapping) get their own specs.

## Gemspec & release

- `required_ruby_version` pins the latest stable Ruby
  (Common Standard → runtime currency policy).
- `metadata["rubygems_mfa_required"] = "true"`; proprietary gems also set
  `allowed_push_host` to a blocking value.
- `spec.files` ships `lib/**/*.rb` plus the documentation suite.
- Release = bump `version.rb`, dated `CHANGELOG.md` entry, `rake release`;
  never hand-edit built artifacts.

## Checklist

- [ ] `api-<service>` name, `Api::<Service>` namespace, thin entrypoint
- [ ] Stdlib-first; runtime deps justified in ARCHITECTURE
- [ ] Client + Configuration + typed errors + isolated transport
- [ ] Secrets redacted in `#inspect` and logger hooks
- [ ] Auth documented "in one picture"; unverified flows flagged
- [ ] games.directory provider flow supported or explicitly N/A
- [ ] ARCHITECTURE / INSTALL / USAGE / SCHEMA / examples all present
- [ ] YARD on the entire public surface; rubocop clean
- [ ] Offline test suite
- [ ] README = Navigation + License only; registry entry updated
