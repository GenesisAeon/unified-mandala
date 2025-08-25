# Unified Mandala Integration Guide

This guide explains how to apply the Unified Mandala integration pack and run the core services for local development.

## Apply the integration pack

1. Place configuration files for your integration in the `integration/pack` directory. Each file keeps its relative path when copied.
2. Run the apply script:
   ```bash
   node integration/apply.mjs
   ```
   The script copies every file from `integration/pack` into the repository root, creating directories as needed. Existing files are not overwritten.

## Start services

After applying the integration pack the repository contains service entrypoints. The following package scripts start the main APIs:

```bash
pnpm run dev:identity   # identity service
pnpm run dev:registry   # registry service
pnpm run dev:collab     # collaboration service
pnpm run dev:admin      # administration service
```

These commands expect the integration pack to provide the corresponding scripts.

## Notes

- The apply script is idempotent and will only copy new files.
- Remove or update files in `integration/pack` and rerun the script to sync changes.
- See `advancedToDo.yaml` for remaining integration tasks.
