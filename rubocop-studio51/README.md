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

In the repo's `Gemfile` (libraries put RuboCop tooling here, not in the gemspec,
because git-sourced dependencies can't be declared in a gemspec):

```ruby
group :development do
  gem "rubocop-studio51", git: "https://github.com/studio51/standards", glob: "rubocop-studio51/*.gemspec"
end
```

In `.rubocop.yml` (already wired by the `ruby-gem` stack template):

```yaml
require:
  - rubocop-studio51

Studio51/CommentBlockTermination:
  Enabled: true
  Include:
    - "lib/**/*.rb"

Studio51/EmptyLineBeforeTrailingExpression:
  Enabled: true
  Include:
    - "lib/**/*.rb"
```

The rest of the house style is enforced with built-in cops — see
[`templates/stacks/ruby-gem/files/.rubocop.yml`](../templates/stacks/ruby-gem/files/.rubocop.yml),
the canonical configuration scaffolded into every Studio51 Ruby repo.
