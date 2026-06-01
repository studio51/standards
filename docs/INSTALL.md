# Install & setup

The CLI is zero-install via `npx`. You only need Node >= 18.

## Scaffold into a new project

```bash
cd my-new-project
npx @studio51/create          # interactive
# or non-interactive:
npx @studio51/create --name orbit --type plugin --stack js-vanilla --license Proprietary
```

## Re-sync an existing repo

```bash
npx @studio51/create update   # refresh managed standard files in place
```

## Run from a local clone

```bash
node cli/bin/create.js --help
node cli/bin/create.js --dry-run --dir /path/to/repo
```
