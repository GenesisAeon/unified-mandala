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

This summarizes open items per folder without touching the large conversation
datasets.

## Handling Large Conversation Files

Datasets such as `newadvancedconversations.json` in this directory are
intentionally **not** opened directly—they are huge. Use the parsing utilities
in `scripts/` (for example `split-newadvanced-conversations.ts`) whenever you
need to extract snippets or generate tasks from them.
