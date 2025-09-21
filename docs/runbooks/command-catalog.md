# Unified Mandala Command Catalog

_Generated:_ 2025-09-19T20:12:41Z  
_Source data:_ [`command-catalog.yaml`](command-catalog.yaml), [`command-catalog.json`](command-catalog.json)

Diese Sammlung bündelt pnpm-Skripte, Shell-Kommandos sowie wiederverwendbare Tools, die im Repository `unified-mandala` verfügbar sind. Kategorien spiegeln die Playbook-Struktur und MandalaMap-Owner wider, damit Runs im Fraktallauf schnell andocken können.

## Setup & Environment

> Bootstrap developer workstations and core tooling parity.

| Command                     | Type                                                    | Runs                                                                                                                                                                          | Beschreibung |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| script.setup-dev-env        | `scripts/setup-dev-env.sh`, `scripts/setup-dev-env.ps1` | Guided bootstrap scripts for local developer workstations (Bash & PowerShell); PowerShell variant skips `corepack enable` without admin rights and prints NATS install hints. |
| script.nats-doctor          | `scripts/nats-dev-check.mjs`                            | JetStream readiness probe validating connection, default stream and feature flag KV bucket; prints setup hints and references `docs/runbooks/nats-jetstream.md`.              |
| script.run-powershell       | `scripts/run-powershell.mjs`                            | Node helper selecting `pwsh`/Windows PowerShell before invoking repository `.ps1` tooling.                                                                                    |
| script.build_pr_e_tree      | `build_pr_E_tree.sh`                                    | Helper script for building PR tree visualizations (variant E).                                                                                                                |
| script.build_pr_f_tree      | `build_pr_F_tree.sh`                                    | Helper script for building PR tree visualizations (variant F).                                                                                                                |
| script.codex-sync           | `codex-sync.sh`                                         | Synchronizes codex states across environments.                                                                                                                                |
| script.docker-compose-local | `docker-compose.local.yaml`                             | Docker Compose definition for local offline stack parity.                                                                                                                     |
| script.docker-compose       | `docker-compose.yml`                                    | Primary Docker Compose file with multiple service profiles.                                                                                                                   |
| script.setup-dev-container  | `Dockerfile.dev`                                        | Dev container definition aligning Node 20 + Python 3 toolchains.                                                                                                              |
