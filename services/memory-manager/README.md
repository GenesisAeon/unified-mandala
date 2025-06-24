# Memory Manager Service

This module stores conversation fragments in short, mid and long term buckets. It exposes a tiny API used by feedback agents and cleanup tasks described in [docs/MemoryFeedbackLoops.md](../../docs/MemoryFeedbackLoops.md).

## Purpose
The manager collects text entries across `daily`, `weekly` and `longterm` categories. Entries expire based on configurable intervals so the memory remains concise for periodic scans.

## API
- `add(category, text)` – push a new entry into the given bucket.
- `get(category)` – retrieve all strings for that category.
- `ingestFragments(files)` – read newline separated fragments from files and store them in the `daily` bucket.
- `stop()` – clear internal timers and stop automatic cleanup.

These methods enable agents to write, query and cycle memory during automated feedback loops.
