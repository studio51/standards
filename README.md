# Studio51 Solutions Standards

Canonical `README`, `LICENSE`, `COPYRIGHT`, `AGENTS.md`, GitHub meta files, and per-stack configs shared by every Studio51 project, plus a zero-install CLI that scaffolds them into a new or existing repo.

## Navigation

This repository adheres to the [Studio51 Solutions Common Standard v2](standards/common/v2/STANDARD.md), with each section documented properly in its own file.

- [Architecture](docs/ARCHITECTURE.md)
- [Install & setup](docs/INSTALL.md)
- [Usage](docs/USAGE.md)
- [Token reference](TOKENS.md)
- [Agent guide](AGENTS.md)

### Standards

Standards are versioned in directories under [`standards/`](standards/); a new
version is a new directory, and published versions are only ever errata-fixed.
See the [Common Standard](standards/common/v2/STANDARD.md) for the versioning
model and how a repo declares adherence. v2 lands work straight on the
integration branch, as the owner's own signed commits with no co-author, merge
commits only, and the latest of every dependency; v1 stays published for repos
that haven't migrated yet.

| Standard | Current | Status |
|---|---|---|
| [Common](standards/common/v2/STANDARD.md) | v2 | active |
| [API Gem](standards/api-gem/v2/STANDARD.md) | v2 | active |
| [App (Rails)](standards/app-rails/v2/STANDARD.md) | v2 | active |
| [App (Next.js)](standards/app-nextjs/v2/STANDARD.md) | v2 | active |
| [App (Swift)](standards/app-swift/v2/STANDARD.md) | v2 | active |
| [Tool](standards/tool/v1/STANDARD.md) | v1 | draft |

### Repository registry

> **This registry lives only in the standards repo.** It is the org-wide
> ledger of adoption across the `studio51` and `games-directory` organisations,
> updated whenever a repo is created, migrated, or archived. `none` means the
> repo has not yet been brought onto a standard; migrating the backlog is
> tracked work, one repo at a time.

#### studio51

| Repository | Standard | Version | Status | Notes |
|---|---|---|---|---|
| [jamcd](https://github.com/studio51/jamcd) | app-rails | v1 → v2 ([#32](https://github.com/studio51/jamcd/pull/32)) | active |  |
| [lottly.web](https://github.com/studio51/lottly.web) | app-rails | v1 → v2 ([#24](https://github.com/studio51/lottly.web/pull/24)) | active |  |
| [observatory](https://github.com/studio51/observatory) | common | v1 → v2 ([#2](https://github.com/studio51/observatory/pull/2)) | active |  |
| [orbit](https://github.com/studio51/orbit) | common | - → v2 ([#10](https://github.com/studio51/orbit/pull/10)) | active |  |
| [pub-crawler](https://github.com/studio51/pub-crawler) | app-rails | v1 → v2 ([#31](https://github.com/studio51/pub-crawler/pull/31)) | active |  |
| [snapshield-ios](https://github.com/studio51/snapshield-ios) | app-swift | v1 → v2 ([#6](https://github.com/studio51/snapshield-ios/pull/6)) | active | SwiftUI iOS app; reference implementation for the App (Swift) standard |
| [snapshield-marketing](https://github.com/studio51/snapshield-marketing) | app-nextjs | v1 → v2 ([#8](https://github.com/studio51/snapshield-marketing/pull/8)) | active | Snapshield marketing site (Next.js) |
| [snapshield-studio](https://github.com/studio51/snapshield-studio) | app-rails | v1 → v2 ([#30](https://github.com/studio51/snapshield-studio/pull/30)) | active | Snapshield admin dashboard + JSON API (Rails 8 · Hotwire · Avo) |
| [standards](https://github.com/studio51/standards) | common | v2 | active | this repo, defines the standards |
| [story-teller](https://github.com/studio51/story-teller) | app-rails | v1 → v2 ([#57](https://github.com/studio51/story-teller/pull/57)) | active | children's picture books, read aloud (Rails 8 JSON API · React SPA); adopted in studio51/story-teller#3 |
| [symbology](https://github.com/studio51/symbology) | common | v1 → v2 ([#2](https://github.com/studio51/symbology/pull/2)) | active |  |
| [trailblazer](https://github.com/studio51/trailblazer) | common | - → v2 ([#5](https://github.com/studio51/trailblazer/pull/5)) | active |  |
| [vladthe.dev](https://github.com/studio51/vladthe.dev) | app-nextjs | v1 → v2 ([#42](https://github.com/studio51/vladthe.dev/pull/42)) | active | personal site (vladthe.dev); reference implementation for the App (Next.js) standard; formerly `radulescuvlad.dev` |
| [waypoint](https://github.com/studio51/waypoint) | common | v1 → v2 ([#2](https://github.com/studio51/waypoint/pull/2)) | active |  |
| [website](https://github.com/studio51/website) | app-rails | v1 → v2 ([#28](https://github.com/studio51/website/pull/28)) | active |  |
| [bettersheets](https://github.com/studio51/bettersheets) | none | - | active | fork |
| [booqmark.it](https://github.com/studio51/booqmark.it) | none | - | active | formerly `web-booqmark.it` |
| [conquess](https://github.com/studio51/conquess) | none | - | active |  |
| [ehcp-pro](https://github.com/studio51/ehcp-pro) | none | - | active |  |
| [equusfirst.co.uk](https://github.com/studio51/equusfirst.co.uk) | none | - | active |  |
| [fluent-icons](https://github.com/studio51/fluent-icons) | none | - | active |  |
| [frequency](https://github.com/studio51/frequency) | none | - | active |  |
| [gaming-stars-app](https://github.com/studio51/gaming-stars-app) | none | - | active |  |
| [gizmo](https://github.com/studio51/gizmo) | none | - | active |  |
| [gridlecss](https://github.com/studio51/gridlecss) | none | - | active |  |
| [little-days-out](https://github.com/studio51/little-days-out) | none | - | active |  |
| [lottly.android](https://github.com/studio51/lottly.android) | none | - | active |  |
| [lottly.ios](https://github.com/studio51/lottly.ios) | none | - | active |  |
| [music](https://github.com/studio51/music) | none | - | active |  |
| [nina](https://github.com/studio51/nina) | none | - | active |  |
| [parser](https://github.com/studio51/parser) | none | - | active |  |
| [reforge.app](https://github.com/studio51/reforge.app) | none | - | active |  |
| [sentinel](https://github.com/studio51/sentinel) | none | - | active |  |
| [sixideas-app](https://github.com/studio51/sixideas-app) | none | - | active |  |
| [stage](https://github.com/studio51/stage) | none | - | active |  |
| [temp-homey-app](https://github.com/studio51/temp-homey-app) | none | - | active |  |
| [thronebound](https://github.com/studio51/thronebound) | none | - | active |  |
| [tibby.js](https://github.com/studio51/tibby.js) | none | - | active |  |
| [tippy](https://github.com/studio51/tippy) | none | - | active |  |
| [tool.jwgbs](https://github.com/studio51/tool.jwgbs) | none | - | active | formerly `tool-jwgbs-scaffold` |
| [visualizer](https://github.com/studio51/visualizer) | none | - | active |  |
| [wave51-app](https://github.com/studio51/wave51-app) | none | - | active |  |
| [web-bwardelectrical](https://github.com/studio51/web-bwardelectrical) | none | - | active |  |
| [web-goprintanddesign](https://github.com/studio51/web-goprintanddesign) | none | - | active |  |
| [web-gridlecss](https://github.com/studio51/web-gridlecss) | none | - | active |  |
| [web-suntraplounge](https://github.com/studio51/web-suntraplounge) | none | - | active |  |
| [web-whitmoretearooms](https://github.com/studio51/web-whitmoretearooms) | none | - | active |  |
| [zapex](https://github.com/studio51/zapex) | none | - | active |  |

#### games-directory

| Repository | Standard | Version | Status | Notes |
|---|---|---|---|---|
| [api.fortnite](https://github.com/games-directory/api.fortnite) | api-gem | v1 → v2 ([#7](https://github.com/games-directory/api.fortnite/pull/7)) | active | formerly `api-fortnite` |
| [api.halo](https://github.com/games-directory/api.halo) | api-gem | v1 → v2 ([#5](https://github.com/games-directory/api.halo/pull/5)) | active | formerly `api-halo` |
| [api.play-goals](https://github.com/games-directory/api.play-goals) | api-gem | v1 → v2 ([#10](https://github.com/games-directory/api.play-goals/pull/10)) | active | formerly `api-playgoals` |
| [api.play-station](https://github.com/games-directory/api.play-station) | api-gem | v1 → v2 ([#8](https://github.com/games-directory/api.play-station/pull/8)) | active | PlayStation Network and Store client (psn-api gem), formerly api-play-station-network; adopted in [#4](https://github.com/games-directory/api.play-station/pull/4); the Api:: namespace, stdlib transport and typed errors are still to migrate |
| [api.rocket-league](https://github.com/games-directory/api.rocket-league) | api-gem | v1 → v2 ([#6](https://github.com/games-directory/api.rocket-league/pull/6)) | active |  |
| [api.xbox](https://github.com/games-directory/api.xbox) | api-gem | v1 → v2 ([#9](https://github.com/games-directory/api.xbox/pull/9)) | active | formerly `api-xbox-live` |
| [app.directory.ios](https://github.com/games-directory/app.directory.ios) | app-swift | v1 → v2 ([#5](https://github.com/games-directory/app.directory.ios/pull/5)) | active |  |
| [app.vault.ios](https://github.com/games-directory/app.vault.ios) | app-swift | v1 → v2 ([#10](https://github.com/games-directory/app.vault.ios/pull/10)) | active | Vault, the games.directory collection app for iPhone (SwiftUI); adopted in games-directory/vault.ios#2; formerly `vault.ios` |
| [games.directory](https://github.com/games-directory/games.directory) | app-rails | v1 → v2 ([#2153](https://github.com/games-directory/games.directory/pull/2153)) | active | reference implementation for the App (Rails) standard |
| [-deprecated-api-rocketleague](https://github.com/games-directory/-deprecated-api-rocketleague) | none | - | **archived** | deprecated |
| [.github](https://github.com/games-directory/.github) | none | - | active | org meta |
| [api-play-station-network--ARCHIVED](https://github.com/games-directory/api-play-station-network--ARCHIVED) | none | - | **archived** |  |
| [api.call-of-duty--archive](https://github.com/games-directory/api.call-of-duty--archive) | none | - | deprecated | formerly `api-cod--DEPRECATED` |
| [api.cs-go](https://github.com/games-directory/api.cs-go) | none | - | active | formerly `api-cs-go`; fork |
| [api.giantbomb](https://github.com/games-directory/api.giantbomb) | none | - | active | formerly `api-giantbomb` |
| [api.path-of-exile](https://github.com/games-directory/api.path-of-exile) | none | - | active | formerly `api-path-of-exile` |
| [api.steam](https://github.com/games-directory/api.steam) | none | - | active | formerly `api-steam`; fork |
| [api.steam-store](https://github.com/games-directory/api.steam-store) | none | - | active | formerly `api-steam-store` |
| [api.valorant.js](https://github.com/games-directory/api.valorant.js) | none | - | active | formerly `api-valorant.js` |
| [api.valorant.ruby](https://github.com/games-directory/api.valorant.ruby) | none | - | active | formerly `api-valorant` |
| [badger](https://github.com/games-directory/badger) | none | - | active |  |
| [cache](https://github.com/games-directory/cache) | none | - | active |  |
| [cache-history](https://github.com/games-directory/cache-history) | none | - | active |  |
| [findings](https://github.com/games-directory/findings) | none | - | active |  |
| [fork.api.giantbomb](https://github.com/games-directory/fork.api.giantbomb) | none | - | active | formerly `giant_bomb_api`; fork |
| [fork.api.play-station](https://github.com/games-directory/fork.api.play-station) | none | - | active | fork |
| [fork.api.playstation-store](https://github.com/games-directory/fork.api.playstation-store) | none | - | active | fork |
| [fork.api.retroachievements](https://github.com/games-directory/fork.api.retroachievements) | none | - | active | fork |
| [fork.api.retroachievements--retired](https://github.com/games-directory/fork.api.retroachievements--retired) | none | - | active | formerly `retroachievements-js`; fork |
| [fork.rrrocket](https://github.com/games-directory/fork.rrrocket) | none | - | active | fork |
| [fork.xbox.download-assistant](https://github.com/games-directory/fork.xbox.download-assistant) | none | - | active | fork; formerly `XboxDownload` |
| [i18n-inflections](https://github.com/games-directory/i18n-inflections) | none | - | active |  |
| [lazy-loader](https://github.com/games-directory/lazy-loader) | none | - | active |  |
| [oauth.battle-net](https://github.com/games-directory/oauth.battle-net) | none | - | active | formerly `omniauth-battle-net`; fork |
| [oauth.epic](https://github.com/games-directory/oauth.epic) | none | - | active | formerly `epic-oauth` |
| [oauth.path-of-exile](https://github.com/games-directory/oauth.path-of-exile) | none | - | active | formerly `path-of-exile-oauth` |
| [scraper](https://github.com/games-directory/scraper) | none | - | active |  |
| [sidekiq-superworker](https://github.com/games-directory/sidekiq-superworker) | none | - | active | fork |
| [source.goals-companion](https://github.com/games-directory/source.goals-companion) | none | - | active |  |
| [temporalize](https://github.com/games-directory/temporalize) | none | - | active |  |
| [tool-request-relay--ARCHIVED](https://github.com/games-directory/tool-request-relay--ARCHIVED) | none | - | **archived** |  |
| [tool.database.gog](https://github.com/games-directory/tool.database.gog) | none | - | active | formerly `tool-gog-database`; fork |
| [tool.halo.theater](https://github.com/games-directory/tool.halo.theater) | none | - | active |  |
| [tool.map.dysmantle](https://github.com/games-directory/tool.map.dysmantle) | none | - | active | formerly `tool-dysmantle-map`; fork |
| [tool.playform-messenger--retired](https://github.com/games-directory/tool.playform-messenger--retired) | none | - | active | formerly `app-playform-messenger` |
| [tool.xbox.oauth](https://github.com/games-directory/tool.xbox.oauth) | none | - | active | formerly `xbox-oauth` |

#### pacMakaveli

Personal repositories, listed once they adopt a standard.

| Repository | Standard | Version | Status | Notes |
|---|---|---|---|---|
| [diskwhy](https://github.com/pacMakaveli/diskwhy) | tool | v1 → v2 ([#4](https://github.com/pacMakaveli/diskwhy/pull/4)) | active | |

## License

Proprietary, © 2026 Studio51 Solutions. Internal tooling for Studio51 projects.
