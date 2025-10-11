# SyncRunner

## Responsibilities

- Synchronisiert CREP-Zustände zwischen laufenden Agenten.
- Erkennt symbolische Kollisionen und startet Resync-Zyklen.

## Parameters

- `syncFile` – Quellpfad zu `codexsync.yaml`.
- `autoResync` – Boolescher Schalter für automatische Zyklen.

## Example usage

```bash
node sync-runner.js --file codexsync.yaml
```
