# Advanced Progress Guide

This guide describes how to keep `advancedprogress.json` in sync.

## Updating Progress

Run the maintenance script after making changes:

```bash
node repositorypflege/update-advanced-progress.js
```

The script now records a `changedFiles` list which captures the files currently
modified in the working tree and stamps a `lastUpdated` timestamp. This helps
trace fractal updates across commits.

## Handling Large Conversation Files

Datasets such as `newadvancedconversations.json` in this directory are
intentionally **not** opened directly—they are huge. Use the parsing utilities
in `scripts/` (for example `split-newadvanced-conversations.ts`) whenever you
need to extract snippets or generate tasks from them.
