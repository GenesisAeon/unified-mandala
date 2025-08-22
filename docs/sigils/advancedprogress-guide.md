# Advanced Progress Guide

This guide describes how to keep `advancedprogress.json` in sync.

## Updating Progress

Run the maintenance script after making changes:

```bash
node repositorypflege/update-advanced-progress.js
```

The script now records a `changedFiles` list which captures the files currently
modified in the working tree. This helps trace fractal updates across commits.
