# rubocop-studio51

> Custom RuboCop cops for the Studio51 Ruby house style — the rules the stock
> cops can't express.

## Cops

| Cop | Enforces |
| --- | --- |
| `Studio51/CommentBlockTermination` | Documentation blocks separate prose from `@` tag lines with a bare `#`, and end with a bare `#` when (and only when) the last line is prose. |
| `Studio51/EmptyLineBeforeTrailingExpression` | A multi-statement method body breathes: an empty line before its final expression. Parallel setup statements (assignments, as in `initialize`) stay tight. |

Both cops are autocorrectable (`rubocop -a`).

## Usage

These cops are house-wide: every Studio51 Ruby repo wires them in, regardless
of stack. They ship pre-wired in both the `ruby-gem` and `rails` stack
`.rubocop.yml` templates; the only per-stack difference is the `Include` glob
(`lib/**/*.rb` for a gem, `app/**/*.rb` + `lib/**/*.rb` for an app).

In the repo's `Gemfile` (RuboCop tooling lives here, not in a gemspec, because
git-sourced dependencies can't be declared in a gemspec):

```ruby
group :development do
  gem "rubocop-studio51", git: "https://github.com/studio51/standards", glob: "rubocop-studio51/*.gemspec", require: false
end
```

In `.rubocop.yml` (already wired by the `ruby-gem` and `rails` stack templates):

```yaml
require:
  - rubocop-studio51

Studio51/CommentBlockTermination:
  Enabled: true
  Include:
    - "app/**/*.rb"   # apps; gems use lib/**/*.rb
    - "lib/**/*.rb"

Studio51/EmptyLineBeforeTrailingExpression:
  Enabled: true
  Include:
    - "app/**/*.rb"   # apps; gems use lib/**/*.rb
    - "lib/**/*.rb"
```

The rest of the house style is enforced with built-in cops — see the canonical
stack configurations scaffolded into every Studio51 Ruby repo
([`ruby-gem`](../templates/stacks/ruby-gem/files/.rubocop.yml),
[`rails`](../templates/stacks/rails/files/.rubocop.yml)).
