# Mandala Rollout Command Tracker

_Fraktal 87 · Stand: 30.11.2025_

Die Tabelle bildet die sechs Phasen des Mandala-Rollouts auf konkrete Kommandos ab. Status-Legende:
**ready** = etabliert, **in-progress** = aktiv in Arbeit, **planned** = geplant, **new** = frisch ergänzt,
**wired** = automatisiert, **reference** = optionaler Gegencheck.

## Phase 0 – Hygiene & Ports · Status: ready · Gate: `pnpm guard:no-dotenv`

| Kommando                                 | Status | Hinweis                                                             |
| ---------------------------------------- | ------ | ------------------------------------------------------------------- |
| `. ./scripts/dev-helper.ps1; Stop-UM`    | ready  | Ports 3001–4021 freiräumen, bevor der Stack startet.                |
| `. ./scripts/dev-helper.ps1; Start-NATS` | ready  | Lokalen NATS (JetStream) aktivieren; alternativ `pnpm nats:docker`. |
| `pnpm guard:no-dotenv`                   | ready  | Verhindert `.env*` Dateien im Commit (Husky-Gate).                  |

## Phase 1 – Core-Stack + Health · Status: ready · Gate: `http://localhost:3999/health`

| Kommando                                | Status | Hinweis                                                                       |
| --------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `pnpm dev:stack`                        | ready  | Startet API, Flags, Realtime-Hub & Share-Service im Dev-Modus.                |
| `pnpm dev:health`                       | ready  | Aggregiert `/health`-Endpunkte auf Port 3999 (Offset-aware).                  |
| `pnpm -F mandala-ui dev -- --port 5173` | ready  | Dev-UI mit Vite (Proxy → Port 4000).                                          |
| `pnpm smoke:ui`                         | ready  | Prüft, ob das UI erreichbar ist (`UI_DEV_URL` wird autodetektiert).           |
| `pnpm diag:shortcuts`                   | ready  | Diagnostiziert Dev-Stack, Health-Aggregator & PowerShell-Hooks (JSON-Output). |

## Phase 2 – AI-Playground (Qwen) · Status: in-progress · Gate: `pnpm smoke:qwen`

| Kommando                                             | Status    | Hinweis                                                                        |
| ---------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| `pnpm start:ollama-proxy`                            | ready     | Startet den Node-Proxy (4000 → Ollama 11434) und normalisiert `output_text`.   |
| `pnpm ps:umo`                                        | ready     | PowerShell-Shortcut: Proxy + mandala-ui Dev-Server (Port 5173).                |
| `pnpm smoke:qwen`                                    | ready     | End-to-End-Smoke UI → `/api/ai/chat` → Qwen (Ollama/vLLM), erwartet „Qwen ok“. |
| `pnpm ps:smoke-qwen`                                 | wired     | PowerShell-Shortcut für den Smoke (`AI_PROVIDER=qwen-ollama`).                 |
| `pnpm hook:qwen-smoke`                               | wired     | Pre-Push-Hook; läuft bei `AI_PROVIDER=qwen-*` oder `UM_RUN_QWEN_SMOKE=1`.      |
| `curl http://localhost:11434/api/chat ...`           | reference | Direkter Ollama-Test (lokale Modellprobe).                                     |
| `curl http://localhost:8000/v1/chat/completions ...` | reference | Direkter vLLM-Test, falls entsprechender Backendpfad aktiv ist.                |

## Phase 3 – Realtime Cosmic-Web · Status: ready · Gate: `pnpm demo:cosmic`

| Kommando                | Status | Hinweis                                                                 |
| ----------------------- | ------ | ----------------------------------------------------------------------- |
| `pnpm demo:cosmic`      | ready  | Generiert Demo-Artefakte und publiziert Ticks.                          |
| `pnpm sub:cosmic`       | ready  | Optionaler Subscriber für `demo.cosmic` zum Monitoring.                 |
| `pnpm start:cosmic-web` | ready  | Komplettpfad (NATS, Services, UI, Smoke) per Ein-Kommando-Orchestrator. |

## Phase 4 – Climate-MVP · Status: planned · Gate: `STAC validation + KPI sichtbar`

| Kommando                                   | Status  | Hinweis                                                 |
| ------------------------------------------ | ------- | ------------------------------------------------------- |
| `pnpm adapter:build:era5`                  | planned | Einstieg mit kleiner ERA5-Region (Projekt-Venv).        |
| `pnpm adapter:build:oisst`                 | planned | Alternative/ergänzende Pipeline in kleiner Ausbaustufe. |
| `python -m tools.stac.validate <artifact>` | planned | Validiert die erzeugten STAC-Dateien.                   |

## Phase 5 – Observability & Governance · Status: ready · Gate: `pnpm check:ci`

| Kommando                   | Status | Hinweis                                                                  |
| -------------------------- | ------ | ------------------------------------------------------------------------ |
| `pnpm check:ci`            | ready  | Typecheck, Unit, Schema, Maps, Repomap, Sanity & Policy in einem Bundle. |
| `pnpm policy:check`        | ready  | Führt OPA/Guardrails/Kyverno + Sigillin-Reports aus.                     |
| `pnpm observability:check` | ready  | Prometheus/Grafana-Scrapes (Port 3300) validieren.                       |

## Phase 6 – Showtime Profil · Status: planned · Gate: `pnpm live:std + pnpm smoke:live`

| Kommando          | Status  | Hinweis                                                 |
| ----------------- | ------- | ------------------------------------------------------- |
| `pnpm live:std`   | planned | Startet das Live-Profil (Services + Health-Aggregator). |
| `pnpm smoke:live` | planned | Prüft `/api/ai/chat` nach dem Live-Start.               |

> Ergänzung: `.github/workflows/ci.qwen-smoke.yml` bietet eine Self-Hosted-Lane (`ci:qwen-smoke` Label), die auf denselben
> Smoke setzt. Fortschritt und offene Aufgaben werden zusätzlich in `codexfeedback.*` dokumentiert.
