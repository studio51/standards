# Studio51 Solutions Standards

Canonical `README`, `LICENSE`, `COPYRIGHT`, `AGENTS.md`, GitHub meta files, and per-stack configs shared by every Studio51 project, plus a zero-install CLI that scaffolds them into a new or existing repo.

## Navigation

This repository adheres to the [Studio51 Solutions Common Standard v1](standards/common/v1/STANDARD.md), with each section documented properly in its own file.

- [Architecture](docs/ARCHITECTURE.md)
- [Install & setup](docs/INSTALL.md)
- [Usage](docs/USAGE.md)
- [Token reference](TOKENS.md)
- [Agent guide](AGENTS.md)

### Standards

Standards are versioned in directories under [`standards/`](standards/); a new
version is a new directory, and published versions are only ever errata-fixed.
See the [Common Standard](standards/common/v1/STANDARD.md) for the versioning
model and how a repo declares adherence.

| Standard | Current | Status |
|---|---|---|
| [Common](standards/common/v1/STANDARD.md) | v1 | active |
| [API Gem](standards/api-gem/v1/STANDARD.md) | v1 | active |
| [App](standards/app/v1/STANDARD.md) | v1 | active |
| [App (Next.js)](standards/app-nextjs/v1/STANDARD.md) | v1 | active |
| [App (Swift)](standards/app-swift/v1/STANDARD.md) | v1 | active |
| [Tool](standards/tool/v1/STANDARD.md) | v1 | draft |

### Repository registry

> **This registry lives only in the standards repo.** It is the org-wide
> ledger of adoption across the `studio51` and `games-directory` organisations,
> updated whenever a repo is created, migrated, or archived. `none` means the
> repo has not yet been brought onto a standard; migrating the backlog is
> tracked work, one PR per repo.

#### studio51

| Repository | Standard | Version | Status | Notes |
|---|---|---|---|---|
| [standards](https://github.com/studio51/standards) | common | v1 | active | this repo — defines the standards |
| [radulescuvlad.dev](https://github.com/studio51/radulescuvlad.dev) | app-nextjs | v1 | active | personal site (vladthe.dev); reference implementation for the App (Next.js) standard |
| [snapshield-marketing](https://github.com/studio51/snapshield-marketing) | app-nextjs | v1 | active | Snapshield marketing site (Next.js) |
| [snapshield-studio](https://github.com/studio51/snapshield-studio) | app | v1 | active | Snapshield admin dashboard + JSON API (Rails 8 · Hotwire · Avo) |
| [snapshield-ios](https://github.com/studio51/snapshield-ios) | app-swift | v1 | active | SwiftUI iOS app; reference implementation for the App (Swift) standard |
| [story-teller](https://github.com/studio51/story-teller) | none | — | active | |
| [little-days-out](https://github.com/studio51/little-days-out) | none | — | active | |
| [reforge.app](https://github.com/studio51/reforge.app) | none | — | active | |
| [music](https://github.com/studio51/music) | none | — | active | |
| [orbit](https://github.com/studio51/orbit) | none | — | active | |
| [trailblazer](https://github.com/studio51/trailblazer) | none | — | active | |
| [sentinel](https://github.com/studio51/sentinel) | none | — | active | |
| [fluent-icons](https://github.com/studio51/fluent-icons) | none | — | active | |
| [web](https://github.com/studio51/web) | none | — | active | |
| [conquess](https://github.com/studio51/conquess) | none | — | active | |
| [ehcp-pro](https://github.com/studio51/ehcp-pro) | none | — | active | |
| [frequency](https://github.com/studio51/frequency) | none | — | active | |
| [thronebound](https://github.com/studio51/thronebound) | none | — | active | |
| [bettersheets](https://github.com/studio51/bettersheets) | none | — | active | |
| [parser](https://github.com/studio51/parser) | none | — | active | |
| [gizmo](https://github.com/studio51/gizmo) | none | — | active | |
| [tippy](https://github.com/studio51/tippy) | none | — | active | |
| [nina](https://github.com/studio51/nina) | none | — | active | |
| [gaming-stars-app](https://github.com/studio51/gaming-stars-app) | none | — | active | |
| [website](https://github.com/studio51/website) | none | — | active | |
| [foodadvisor](https://github.com/studio51/foodadvisor) | none | — | active | third-party demo (Strapi) |
| [zapex](https://github.com/studio51/zapex) | none | — | active | |
| [equusfirst.co.uk](https://github.com/studio51/equusfirst.co.uk) | none | — | active | |
| [sixideas-app](https://github.com/studio51/sixideas-app) | none | — | active | |
| [web-whitmoretearooms](https://github.com/studio51/web-whitmoretearooms) | none | — | active | |
| [web-suntraplounge](https://github.com/studio51/web-suntraplounge) | none | — | active | |
| [gridlecss](https://github.com/studio51/gridlecss) | none | — | active | |
| [tibby.js](https://github.com/studio51/tibby.js) | none | — | active | |
| [web-gridlecss](https://github.com/studio51/web-gridlecss) | none | — | active | |
| [tool-jwgbs-scaffold](https://github.com/studio51/tool-jwgbs-scaffold) | none | — | active | |
| [web-bwardelectrical](https://github.com/studio51/web-bwardelectrical) | none | — | active | |
| [web-goprintanddesign](https://github.com/studio51/web-goprintanddesign) | none | — | active | |
| [web-booqmark.it](https://github.com/studio51/web-booqmark.it) | none | — | active | |

#### games-directory

| Repository | Standard | Version | Status | Notes |
|---|---|---|---|---|
| [api-playgoals](https://github.com/games-directory/api-playgoals) | api-gem | v1 | active | |
| [cache](https://github.com/games-directory/cache) | none | — | active | |
| [games.directory](https://github.com/games-directory/games.directory) | app | v1 | active | reference implementation for the App standard |
| [i18n-inflections](https://github.com/games-directory/i18n-inflections) | none | — | active | |
| [api-fortnite](https://github.com/games-directory/api-fortnite) | none | — | active | |
| [api-play-station-network](https://github.com/games-directory/api-play-station-network) | none | — | active | |
| [lazy-loader](https://github.com/games-directory/lazy-loader) | none | — | active | |
| [api-halo](https://github.com/games-directory/api-halo) | none | — | active | |
| [temporalize](https://github.com/games-directory/temporalize) | none | — | active | |
| [xbox-oauth](https://github.com/games-directory/xbox-oauth) | none | — | active | |
| [api-xbox--COMMUNITY](https://github.com/games-directory/api-xbox--COMMUNITY) | none | — | active | community |
| [tool-request-relay--ARCHIVED](https://github.com/games-directory/tool-request-relay--ARCHIVED) | none | — | **archived** | |
| [app-playform-messenger](https://github.com/games-directory/app-playform-messenger) | none | — | active | |
| [tool-gog-database](https://github.com/games-directory/tool-gog-database) | none | — | active | |
| [api-play-station-store](https://github.com/games-directory/api-play-station-store) | none | — | active | |
| [api-play-station-network--ARCHIVED](https://github.com/games-directory/api-play-station-network--ARCHIVED) | none | — | **archived** | |
| [api-xbox-live](https://github.com/games-directory/api-xbox-live) | none | — | active | |
| [api-steam-store](https://github.com/games-directory/api-steam-store) | none | — | active | |
| [tool-dysmantle-map](https://github.com/games-directory/tool-dysmantle-map) | none | — | active | |
| [api-cs-go](https://github.com/games-directory/api-cs-go) | none | — | active | |
| [tool-cod-warzone-datatabase](https://github.com/games-directory/tool-cod-warzone-datatabase) | none | — | active | |
| [api-cod--DEPRECATED](https://github.com/games-directory/api-cod--DEPRECATED) | none | — | deprecated | |
| [api-valorant](https://github.com/games-directory/api-valorant) | none | — | active | |
| [omniauth-battle-net](https://github.com/games-directory/omniauth-battle-net) | none | — | active | |
| [retroachievements-js](https://github.com/games-directory/retroachievements-js) | none | — | active | |
| [XboxDownload](https://github.com/games-directory/XboxDownload) | none | — | active | fork |
| [.github](https://github.com/games-directory/.github) | none | — | active | org meta |
| [badger](https://github.com/games-directory/badger) | none | — | active | |
| [path-of-exile-oauth](https://github.com/games-directory/path-of-exile-oauth) | none | — | active | |
| [api-path-of-exile](https://github.com/games-directory/api-path-of-exile) | none | — | active | |
| [api-valorant.js](https://github.com/games-directory/api-valorant.js) | none | — | active | |
| [scraper](https://github.com/games-directory/scraper) | none | — | active | |
| [epic-oauth](https://github.com/games-directory/epic-oauth) | none | — | active | |
| [api-steam](https://github.com/games-directory/api-steam) | none | — | active | |
| [-deprecated-api-rocketleague](https://github.com/games-directory/-deprecated-api-rocketleague) | none | — | **archived** | deprecated |
| [api-giantbomb](https://github.com/games-directory/api-giantbomb) | none | — | active | |
| [giant_bomb_api](https://github.com/games-directory/giant_bomb_api) | none | — | active | |
| [sidekiq-superworker](https://github.com/games-directory/sidekiq-superworker) | none | — | active | fork |

## License

Proprietary, © 2026 Studio51 Solutions. Internal tooling for Studio51 projects.
