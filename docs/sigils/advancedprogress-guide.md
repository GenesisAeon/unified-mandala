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

## Handling Large Conversation Files

Datasets such as `newadvancedconversations.json` in this directory are
intentionally **not** opened directly—they are huge. Use the parsing utilities
in `scripts/` (for example `split-newadvanced-conversations.ts`) whenever you
need to extract snippets or generate tasks from them.
