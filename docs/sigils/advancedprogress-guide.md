# Advanced Progress Guide

This guide describes how to keep `advancedprogress.json` in sync.

## Updating Progress

Run the maintenance script after making changes:

```bash
node repositorypflege/update-advanced-progress.js
```

The script collects open items from `advancedToDo.json`, `advancedToDo.yaml`
and every fragment in `advancedToDo_parts/`. It also records a `changedFiles`
list capturing the files currently modified in the working tree and stamps a
`lastUpdated` timestamp. This helps trace fractal updates across commits.

By default tasks that reference conversation datasets are skipped. Pass
`--include-conversations` to include them in the generated progress file when
needed:

```bash
node repositorypflege/update-advanced-progress.js --include-conversations
```

To write progress to an alternative file, pass the `--file` flag:

```bash
node repositorypflege/update-advanced-progress.js 5 --file path/to/progress.json
```

## Generating Reports

To view open tasks grouped by their directories, run:

```bash
node repositorypflege/advanced-todo-report.js
```

By default this report skips any tasks referencing `conversations` files to
avoid loading massive datasets. Pass `--include-conversations` if you really
need them. The default text output now also shows how many open tasks exist per
directory and prints a total at the end.

You can cap the number of tasks shown per directory with `--limit`:

```bash
node repositorypflege/advanced-todo-report.js --limit 3
```

For machine-readable output you can add `--json` or `--yaml`:

```bash
node repositorypflege/advanced-todo-report.js --json
node repositorypflege/advanced-todo-report.js --yaml
```

To sort directories by the number of open tasks, pass `--sort count`. The
default alphabetical order can be made explicit with `--sort alpha`:

```bash
node repositorypflege/advanced-todo-report.js --sort count
```

## Handling Large Conversation Files

Datasets such as `newadvancedconversations.json` in this directory are
intentionally **not** opened directly—they are huge. Use the parsing utilities
in `scripts/` (for example `split-newadvanced-conversations.ts`) whenever you
need to extract snippets or generate tasks from them.
