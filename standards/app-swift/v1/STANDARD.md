# Studio51 Solutions App (Swift) Standard · v1

> What a Studio51 Solutions **Swift** application looks like, the native flavour
> of the [App Standard](../../app/v1/STANDARD.md) for Apple-platform apps built
> with Swift and SwiftUI in Xcode rather than Rails or Next.js. Extends the
> [Common Standard v1](../../common/v1/STANDARD.md); it never relaxes it.
>
> **Reference implementation:**
> [snapshield](https://github.com/studio51/snapshield), a SwiftUI iOS app that
> auto-blurs the faces of strangers as you shoot. It was the first Swift app
> brought onto this standard and shaped the conventions below.

## When to use this standard

- Reach for **App (Swift)** when the deliverable is a native Apple-platform app
  (iOS, iPadOS, macOS, watchOS, tvOS, or visionOS) written in Swift, whether it
  ships as an Xcode project or a Swift Package.
- Reach for the **[App (Next.js)](../../app-nextjs/v1/STANDARD.md)** standard for
  TypeScript and React web front-ends, or the plain
  **[App Standard](../../app/v1/STANDARD.md)** for Rails and Hotwire apps. The
  repo's primary runtime decides.
- The `swift` stack (`npx @studio51/create --stack swift`) scaffolds the tooling
  for this standard; `--type app` derives `app-swift` automatically.

## Inherits

- **Common Standard v1** in full: repository skeleton, Navigation README, docs
  suite, code-documentation rules, agent files, workflow conventions, runtime
  currency policy.
- **Stack conventions** from the scaffolded `AGENTS.md` (`swift`): SwiftUI views
  with observable view models, value types by default, SwiftLint clean before
  every commit, and DocC doc comments on every public symbol.

## Repository skeleton

Everything the Common Standard requires, with these Swift-specific expectations:

- **`README.md`** stays minimal, a screenshot, title, tagline, description, the
  **Navigation** menu declaring `App (Swift) Standard v1`, and the license. The
  `.github/workflows/standards.yml` check enforces this.
- **`docs/`** carries all prose, each concern in its own file:
  - `ARCHITECTURE.md`, the platforms and minimum OS versions, the app's layer
    layout, the data and persistence strategy, on-device versus networked work,
    and the key decisions.
  - `INSTALL.md`, the required Xcode and Swift versions, how to open and run the
    project, and the build, test, and lint commands.
  - `USAGE.md`, the main user flows and any runtime configuration.
  - Subsystem-level deep dives live under `docs/<area>/`, never at the repo root.
- **Agent files**, `AGENTS.md` plus `CLAUDE.md` / `CURSOR.md` / `CODEX.md`
  pointers, with the `swift` stack section injected.
- **`.github/`**, `ci.yml` (build, test, and SwiftLint on a macOS runner),
  `standards.yml` (README check), `dependabot.yml` (the `swift` and
  `github-actions` ecosystems), issue and PR templates, and `CODEOWNERS`
  pointing at a real user or team. CI workflows trigger on the repo's actual
  default branch, not a hardcoded `main`.

## Project layout

Whether the app is an Xcode project or a Swift Package, source is organised into
focused groups so views and models stay thin. A single-target iOS app keeps its
Swift sources under one app group with these layers:

- **App entry**, the `@main` `App` type and the root scene only.
- **Views**, SwiftUI views, one primary view per file, named for what they show
  (`CameraScreen`, `SettingsView`). A view owns layout and binding, not business
  logic.
- **View models / controllers**, the observable state behind a screen
  (`@Observable` or `ObservableObject`). Side effects, orchestration, and
  long-running work live here, not in the view body.
- **Engines / services**, the domain work: image processing, recognition,
  capture pipelines, networking clients. Pure where possible, free of SwiftUI
  imports, and unit testable in isolation.
- **Stores**, persistence and shared state (`UserDefaults`, files, SwiftData /
  Core Data, Keychain), behind a type that the rest of the app talks to.
- **Models**, value types: structs and enums for the app's domain, `Codable`
  where they are persisted or sent over the wire.

Views stay declarative (state in, view out). Heavy work is dispatched off the
main actor and results are published back on it. Anything reverse-engineered or
inferred about a private API, file format, or model is flagged as such in the
code and the docs, with the procedure that confirms it, per the Common
Standard's code-documentation rules.

## Swift, SwiftUI & concurrency

- **SwiftUI first** for new UI; drop to UIKit or AppKit only where a control or
  capability genuinely requires it, wrapped behind `UIViewRepresentable` /
  `NSViewRepresentable`.
- **Value types by default.** Prefer structs and enums; reach for a class only
  for reference semantics or framework requirements (observable models, Core
  Data).
- **Swift Concurrency**, `async`/`await`, actors, and structured tasks rather
  than completion handlers or bare `DispatchQueue`. UI state is updated on
  `@MainActor`. New code builds clean under the project's chosen Swift
  concurrency checking and never silences a data-race warning to ship.
- **Naming follows the Swift API Design Guidelines**: `UpperCamelCase` types,
  `lowerCamelCase` members, no Objective-C `NS`/`k` prefixes on new symbols.

## Doc comments (DocC)

The Common Standard requires a doc comment on every public type, method,
property, and constant. In Swift that means DocC triple-slash comments:

- Use `///` above the declaration, a one-line summary sentence, then a blank
  `///` line, then `- Parameters:` and `- Returns:` where they apply.
- One sentence per line; do not hard-wrap a sentence.
- Inline trailing comments for stored properties, enum cases, and grouped
  constants rather than a paragraph above each.
- Group related members under a short `// MARK: -` divider.

```swift
/// Blurs every detected face that does not match an enrolled person.
///
/// - Parameters:
///   - image: The frame to process.
///   - people: The enrolled people to match against.
/// - Returns: A new image with strangers' faces covered.
func blurStrangers(in image: CIImage, against people: [Person]) -> CIImage
```

## Tooling, lint & formatting

- **Lint with SwiftLint.** A `.swiftlint.yml` is committed at the repo root and
  `swiftlint` must be clean before every commit (the `ci.yml` lint job enforces
  it). Adopting the standard on an existing codebase is a one-time
  `swiftlint --fix` pass committed on its own.
- **Format with `swift-format`** (or SwiftLint's formatting rules), not by hand.
- **Dependencies** use Swift Package Manager; the resolved
  `Package.resolved` is committed so builds are reproducible. CocoaPods and
  Carthage are not used in new repos.

## Privacy, configuration & secrets

- **Privacy first.** Process user data on device wherever possible; a feature
  that can run locally does not call out to a server. Every `Info.plist` usage
  string (camera, photos, location) states plainly why the app needs that
  access.
- **Configuration is environment-driven, never committed.** API keys and
  per-environment values come from build settings, `.xcconfig` files, or the
  Keychain at runtime, kept out of source control. `.env` and signing assets are
  git-ignored; an `.xcconfig.example` (or equivalent) documents the shape.
- **Signing and provisioning** are never committed. CI uses managed signing or a
  dedicated signing job; local development uses each developer's own team.

## Runtime currency policy

Per the Common Standard, pin the latest stable runtime and stay current:

- Build with the **latest stable Xcode** and the **latest Swift language mode**;
  pin both in CI (an explicit Xcode version on the runner) so local and CI match.
- Set the **deployment target** to the latest stable OS major, dropping to the
  previous major only with an issue justifying the why plus a PR. We are a small
  team and do not maintain back-compatibility with old OS versions.
- Track the latest SDKs; deprecations are resolved promptly rather than silenced.

## Testing & CI

- Tests run under **XCTest** or the **Swift Testing** framework via `xcodebuild
  test` (the CI `test` job). Engines and view models are unit tested in
  isolation; keep the suite green on the default branch.
- `ci.yml` runs `swiftlint` then builds and tests on a macOS runner with a
  pinned Xcode. A build that only works in the IDE is not done; the
  command-line build is the gate.
- `standards.yml` enforces the minimal README.
