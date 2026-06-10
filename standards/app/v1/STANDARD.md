# Studio51 Solutions App Standard · v1 (draft)

> What a Studio51 Solutions application (Rails or otherwise) looks like.
> Extends the [Common Standard v1](../../common/v1/STANDARD.md); it never
> relaxes it.
>
> **Status: draft.** This standard is a stub awaiting a reference
> implementation; the Common Standard plus the relevant stack section of
> `AGENTS.md` apply in full in the meantime.

## Inherits

- Common Standard v1: skeleton, Navigation README, docs suite, code
  documentation, agent files, workflow conventions, runtime currency policy.
- Stack conventions from the scaffolded `AGENTS.md` (e.g. `rails` /
  `rails-hotwire`): skinny controllers, domain logic in models, committed
  `Gemfile.lock` for applications.

## To be specified in a future revision

- Deployment & environment configuration shape
- Background jobs, storage, and observability conventions
- games.directory integration points for apps, where applicable
