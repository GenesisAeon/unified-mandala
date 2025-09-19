# Command Catalog · Fraktal51

Generated: 2025-10-10T12:00:00Z
Repository: unified-mandala

## Reference Docs

- `docs/roadmap/v1.0-stabilization-playbook.md`
- `docs/roadmap/v1.0-stabilization-playbook.yaml`
- `MandalaMap.md`

## Overview

Konsolidierter Befehlsindex für pnpm-Skripte, Shell-Werkzeuge und AI-gesteuerte Hilfsprogramme im Unified-Mandala-Repository. Die Sammlung ergänzt docs/roadmap/v1.0-stabilization-playbook._ und MandalaMap._ um eine ausführbare Perspektive und erleichtert Fraktalläufe, QA-Checks sowie Governance-Reviews.

Each section lists executable commands with short descriptions, tags and their primary source.

## Environment & Setup

_Stewards:_ DevX Guild, Codex CoreOps

| Command                             | Description                                                                                               | Tags                        | Source                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| `pnpm install`                      | Installiert alle Node-Abhängigkeiten des Monorepos via pnpm Workspace-Resolution.                         | `setup` `node`              | pnpm workspace root                         |
| `pnpm prepare`                      | Initialisiert Husky und installiert Git-Hooks für lint-staged/Prettier.                                   | `setup` `git-hooks`         | package.json:scripts.prepare                |
| `pnpm adapters:ci:install`          | Installiert Python-Abhängigkeiten der Adapter-Suite (requirements.txt) für lokale Läufe und CI.           | `python` `adapters` `setup` | package.json:scripts['adapters:ci:install'] |
| `poetry install --with test`        | Erzeugt ein Poetry-Environment inklusive Test-Abhängigkeiten für Python-Komponenten.                      | `python` `setup`            | AGENTS.md                                   |
| `./scripts/setup-dev-env.sh`        | Automatisiert OS-Paketinstallation, Git-Konfiguration, Python-Venv und pnpm-Setup für neue Arbeitsplätze. | `bootstrap` `setup`         | scripts/setup-dev-env.sh                    |
| `npx pyright`                       | Führt statische Typprüfungen für das Python/TypeScript-Hybrid-Repo mit Pyright aus.                       | `python` `types` `ci`       | AGENTS.md                                   |
| `npx tsc -p tsconfig.json --noEmit` | Validiert den TypeScript-Quellcode ohne Artefakte zu generieren; identisch mit pnpm lint:types.           | `typescript` `types`        | AGENTS.md                                   |

## Build & Release

_Stewards:_ ReleaseOps Circle, VisionContextIntegrator

| Command                    | Description                                                                                                                    | Tags                 | Source                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ------------------------------------------- |
| `pnpm build`               | Transpiliert den TypeScript-Code via tsconfig.build.json und triggert anschliessend pnpm build:agents.                         | `build` `dist-first` | package.json:scripts.build                  |
| `pnpm build:agents`        | Kompiliert Agents-Code mit tsconfig.agents.json und konvertiert AIJuristicAgent nach CJS für Node18-Kompatibilität.            | `build` `agents`     | package.json:scripts['build:agents']        |
| `pnpm build:ui`            | Erzeugt das Frontend-Bundle im Workspace apps/ui via pnpm -F mandala-ui build.                                                 | `build` `ui`         | package.json:scripts['build:ui']            |
| `pnpm build:windows-tools` | Startet das PowerShell-Buildskript für Windows-Hilfsprogramme (tools/windows/build-windows-tools.ps1).                         | `windows` `build`    | package.json:scripts['build:windows-tools'] |
| `pnpm export_depth_bundle` | Erstellt mit scripts/export-depth-bundle.ts ein Sigillin-Tiefenbundle (JSON) und einen Markdown-Index im exports/-Verzeichnis. | `release` `sigils`   | package.json:scripts.export_depth_bundle    |
| `pnpm generate:changelog`  | Generiert CHANGELOG-Einträge aus Commit-Historie über scripts/generate-changelog.js.                                           | `release` `docs`     | package.json:scripts['generate:changelog']  |

## Development & Runtime

_Stewards:_ DevX Guild, Repositorypflege Collective

| Command                          | Description                                                                                                                                     | Tags                       | Source                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------- |
| `pnpm dev`                       | Startet den Mandala-UI-Entwicklungsserver mit UI_DIST=http://localhost:5173 für dist-first Flows.                                               | `dev-server` `ui`          | package.json:scripts.dev                          |
| `pnpm dev:ui`                    | Direkter pnpm -F mandala-ui dev Aufruf für isolierte UI-Entwicklung ohne Proxy-Override.                                                        | `dev-server` `ui`          | package.json:scripts['dev:ui']                    |
| `pnpm dev:services`              | Startet Node-Serviceprozesse via tsx scripts/dev-server.ts im Entwicklungsmodus (rag-api, flags-api, experiments-api, share-api, realtime-hub). | `services` `dev-server`    | package.json:scripts['dev:services']              |
| `pnpm dev:stack`                 | Wrapper um scripts/dev-services.mjs --mode=dev zum simultanen Start aller lokalen Services.                                                     | `services` `orchestration` | package.json:scripts['dev:stack']                 |
| `pnpm start`                     | Baut das UI (pnpm build:ui) und startet anschliessend den Entwicklungsserver (pnpm dev).                                                        | `dev-server` `ui`          | package.json:scripts.start                        |
| `pnpm start:light`               | Erzeugt das UI-Bundle und startet den Light Static Server (scripts/light-static-server.mjs) für Brotli/Gzip-Bereitstellung.                     | `static-serve` `dist`      | package.json:scripts['start:light']               |
| `pnpm start:all`                 | Alias für pnpm dev:stack um alle lokalen Services in einem Schritt zu booten.                                                                   | `services` `orchestration` | package.json:scripts['start:all']                 |
| `pnpm start:services`            | Startet die Service-Orchestrierung im Produktionsmodus (node dist/... --mode=prod) – erfordert vorherigen Build.                                | `services` `production`    | package.json:scripts['start:services']            |
| `pnpm dev:voiceos`               | Führt scripts/voice-os-control-api.ts über run-dist aus, um VoiceOS-Steuerbefehle lokal bereitzustellen.                                        | `voice` `services`         | package.json:scripts['dev:voiceos']               |
| `pnpm ghost-shell:cluster`       | Startet das Ghost-Shell-Cluster (services/ghost-shell/cluster.ts) via run-dist für Multinode-Simulationen.                                      | `ghost-shell` `services`   | package.json:scripts['ghost-shell:cluster']       |
| `pnpm ghost-shell:server`        | Startet den Ghost-Shell-HTTP-Server (services/ghost-shell/server.ts) im Dist-First-Modus.                                                       | `ghost-shell` `services`   | package.json:scripts['ghost-shell:server']        |
| `pnpm generate:ghostshell-nginx` | Erzeugt Nginx-Konfigurationen für Ghost-Shell-Deployments über scripts/generate-ghostshell-nginx.ts.                                            | `ghost-shell` `deployment` | package.json:scripts['generate:ghostshell-nginx'] |

## Linting & Formatting

_Stewards:_ DevX Guild, QualityAssuranceAgent

| Command             | Description                                                                                                                | Tags                | Source                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------ |
| `pnpm lint`         | Aggregiert pnpm lint:types und pnpm lint:eslint für TypeScript- und ESLint-Prüfungen.                                      | `lint` `typescript` | package.json:scripts.lint            |
| `pnpm lint:types`   | Führt tsc -p tsconfig.json --noEmit aus, um TypeScript-Typfehler früh zu erkennen.                                         | `lint` `typescript` | package.json:scripts['lint:types']   |
| `pnpm lint:eslint`  | Prüft {scripts,services,src,tests} mit ESLint inkl. Cache und max-warnings=0.                                              | `lint` `eslint`     | package.json:scripts['lint:eslint']  |
| `pnpm format`       | Formatiert zentrale Dokumente (README, CONTRIBUTING, ONBOARDING, codexfeedback.\*, scripts/dev-services.mjs) mit Prettier. | `format` `prettier` | package.json:scripts.format          |
| `pnpm format:check` | Überprüft Prettier-Formatierung ohne Änderungen zu schreiben.                                                              | `format` `prettier` | package.json:scripts['format:check'] |
| `pnpm lint-staged`  | Führt lint-staged Konfiguration (Prettier/ESLint) im Git-Staging-Kontext aus – verwendet von Husky.                        | `lint` `git-hooks`  | package.json:scripts['lint-staged']  |

## Testing & CI Verification

_Stewards:_ QualityAssuranceAgent, Codex CoreOps

| Command                     | Description                                                                                           | Tags                    | Source                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- | --------------- | ------------------------------------------- |
| `pnpm test`                 | Führt Vitest im Batch-Modus (vitest run) über das Default-Konfigurationsprofil aus.                   | `vitest` `unit`         | package.json:scripts.test                    |
| `pnpm test:watch`           | Startet Vitest im Watch-Modus für interaktives Testen.                                                | `vitest` `dev`          | package.json:scripts['test:watch']           |
| `pnpm test:unit`            | Vitest run --coverage für gezielte Unit-Coverage-Auswertung.                                          | `vitest` `coverage`     | package.json:scripts['test:unit']            |
| `pnpm test:jest`            | Startet die Jest-Suite (legacy/kompatibilitäts Tests).                                                | `jest` `legacy`         | package.json:scripts['test:jest']            |
| `pnpm test:agents`          | Vitest-Läufe für Agentenmodule (Standardkonfiguration).                                               | `agents` `vitest`       | package.json:scripts['test:agents']          |
| `pnpm test:adapters`        | Führt Vitest gezielt für src/adapters/tests/decorators.test.ts aus.                                   | `adapters` `vitest`     | package.json:scripts['test:adapters']        |
| `pnpm test:ts`              | Vitest run mit vitest.config.ts (Standard, ohne Heap-Limits).                                         | `vitest` `typescript`   | package.json:scripts['test:ts']              |
| `pnpm test:ts:ci`           | Vitest run mit NODE_OPTIONS=--max-old-space-size=2048 für CI-freundliche Speichernutzung.             | `vitest` `ci`           | package.json:scripts['test:ts:ci']           |
| `pnpm test:ts:extended`     | Vitest-Extended-Läufe mit ENABLE_EXTENDED_TESTS=1.                                                    | `vitest` `extended`     | package.json:scripts['test:ts:extended']     |
| `pnpm test:ts:experimental` | Aktiviert Extended- und Experimental-Vitest-Suites (ENABLE_EXTENDED_TESTS/ENABLE_EXPERIMENTAL_TESTS). | `vitest` `experimental` | package.json:scripts['test:ts:experimental'] |
| `pnpm test:py`              | Pytest Lauf mit Marker not slow and not experimental (-q).                                            | `pytest` `python`       | package.json:scripts['test:py']              |
| `pnpm test:py:extended`     | Pytest mit deaktivierten experimental Markern (-q).                                                   | `pytest` `python`       | package.json:scripts['test:py:extended']     |
| `pnpm test:py:all`          | Vollständiger Pytest-Lauf (pytest -q).                                                                | `pytest` `python`       | package.json:scripts['test:py:all']          |
| `pnpm test:sigil`           | Validiert Sigillin-Dateien via scripts/validate-sigil-cli.ts (run-dist).                              | `sigils` `validation`   | package.json:scripts['test:sigil']           |
| `pnpm test:ui`              | Vitest run --passWithNoTests für UI-bezogene Tests/Sanity Checks.                                     | `vitest` `ui`           | package.json:scripts['test:ui']              |
| `pnpm qa`                   | führt scripts/qa-test-runner.ts via run-dist aus und protokolliert Ergebnisse in qa-report.log.       | `qa` `automation`       | package.json:scripts.qa                      |
| `pnpm qa:gpt5`              | QA-Lauf mit zusätzlicher Prompts-Analyse (scripts/qa-gpt5.json) für PantheonPortalAnalytics.          | `qa` `prompts`          | package.json:scripts['qa:gpt5']              |
| `pnpm ci:fast-checks`       | Führt zentrale TypeScript- und Pyright-Prüfungen via pnpm -w -r exec aus (tsc + pyright).             | `ci` `lint`             | package.json:scripts['ci:fast-checks']       |
| `pnpm ci:sigils`            | Kombiniert sigils:index:strict, pnpm test:sigil und resonance:calc für Sigillin-Gates.                | `ci` `sigils`           | package.json:scripts['ci:sigils']            |
| `pnpm ci:adapters-offline`  | Erzeugt OISST- und ERA5-Adapter-Artefakte im CI (Fehler toleriert via                                 |                         | true).                                       | `ci` `adapters` | package.json:scripts['ci:adapters-offline'] |
| `pnpm ci:verify`            | Runs pnpm test:ts, sigils:index:strict und adapter:build:era5 als kombinierte CI-Verifikation.        | `ci` `verification`     | package.json:scripts['ci:verify']            |
| `pnpm check:ci`             | Führt tsc --noEmit, pnpm test:ts:ci und pyright hintereinander aus (manueller CI-Spiegel).            | `ci` `verification`     | package.json:scripts['check:ci']             |
| `pnpm cy:run`               | Startet Cypress E2E Tests (cypress run).                                                              | `cypress` `e2e`         | package.json:scripts['cy:run']               |

## Smoke Tests & Runtime Health

_Stewards:_ TelemetryOps, QualityAssuranceAgent

| Command                     | Description                                                                                                 | Tags                  | Source                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------- |
| `pnpm smoke:ui`             | UI-Entwicklungs-Smoke (scripts/smoke/ui-dev-smoke.mjs) prüft Statuscode & Asset-Lieferung.                  | `smoke` `ui`          | package.json:scripts['smoke:ui']             |
| `pnpm smoke:dev`            | Kontrolliert den Dev-Service-Stack via scripts/smoke/dev-server-smoke.mjs (Health-Endpoints).               | `smoke` `services`    | package.json:scripts['smoke:dev']            |
| `pnpm smoke:mrv`            | MRV-spezifischer Smoke-Test zur Validierung von Monitoring-/Reporting-Views.                                | `smoke` `monitoring`  | package.json:scripts['smoke:mrv']            |
| `pnpm smoke:light-static`   | Startet den Light-Static-Server temporär und prüft Brotli/Gzip Header sowie Cache-Control.                  | `smoke` `dist`        | package.json:scripts['smoke:light-static']   |
| `pnpm smoke:ttfb`           | Baut das UI und misst Time-to-First-Byte Kennzahlen (scripts/smoke/ttfb-smoke.mjs).                         | `smoke` `performance` | package.json:scripts['smoke:ttfb']           |
| `pnpm smoke:agents`         | Leichtgewichtiger Agenten-Smoke (scripts/smoke/agents-smoke.mjs) zur Validierung von Routing/Health Checks. | `smoke` `agents`      | package.json:scripts['smoke:agents']         |
| `pnpm agents:health`        | Führt scripts/agents/runner.ts mit --health-all aus und aggregiert Statusberichte.                          | `agents` `health`     | package.json:scripts['agents:health']        |
| `pnpm agents:metrics`       | Aggregiert Agentenmetriken via scripts/agents/metrics-aggregate.ts (run-dist).                              | `agents` `metrics`    | package.json:scripts['agents:metrics']       |
| `pnpm audit:ui-vr`          | Führt scripts/ui-vr-audit.ts aus, um UI/VR-Assets zu prüfen (dist-first).                                   | `audit` `ui`          | package.json:scripts['audit:ui-vr']          |
| `pnpm agents:audit:domains` | Überprüft Agenten-Domain-Mappings mittels scripts/agents/domain-audit.ts.                                   | `agents` `audit`      | package.json:scripts['agents:audit:domains'] |

## Policy, Governance & Mapping

_Stewards:_ AI Governance Council, PactDepthGatekeeper

| Command                        | Description                                                                                                               | Tags                   | Source                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------- |
| `pnpm policy:check`            | Führt die Policy-Suite (OPA, Guardrails, Kyverno) via scripts/policy-suite.mjs aus und schreibt Reports nach out/policy/. | `policy` `governance`  | package.json:scripts['policy:check']            |
| `pnpm kyverno:validate`        | Kyverno-Dry-Run CLI (tools/kyverno-dry-run.mjs) mit MandalaEvent-Fallback-Fixture.                                        | `policy` `kyverno`     | package.json:scripts['kyverno:validate']        |
| `pnpm prompts:coach`           | Trockenlauf für Prompt-Governance (scripts/prompt-coach.mjs --dry).                                                       | `prompts` `governance` | package.json:scripts['prompts:coach']           |
| `pnpm compile:agents-manifest` | Generiert agents_manifest.json via scripts/compile_agents_manifest.js.                                                    | `agents` `docs`        | package.json:scripts['compile:agents-manifest'] |
| `pnpm generate:agents-diagram` | Erzeugt Diagramme in docs/agents/ mittels scripts/generate-agents-diagram.js.                                             | `agents` `diagrams`    | package.json:scripts['generate:agents-diagram'] |
| `pnpm generate:agent-docs`     | Synthesisiert Agenten-Dokumentation (Markdown) aus Metadaten via scripts/generate-agent-docs.js.                          | `agents` `docs`        | package.json:scripts['generate:agent-docs']     |
| `pnpm export:crep-docs`        | Exportiert CREP-Dokumente und Metriken (scripts/export-crep-docs.js).                                                     | `crep` `docs`          | package.json:scripts['export:crep-docs']        |
| `pnpm symbolzeit:run`          | Ausführung von scripts/symbolzeit-runner.js zur Aktualisierung symbolischer Zeitachsen.                                   | `governance` `rituals` | package.json:scripts['symbolzeit:run']          |
| `pnpm aeon:transition`         | Orchestriert Aeon-Transitionspfade (scripts/aeon-transition-workflow.js).                                                 | `aeon` `governance`    | package.json:scripts['aeon:transition']         |
| `pnpm map:mandala`             | Validiert MandalaMap-Artefakte (scripts/mandala-map-validate.mjs).                                                        | `mapping` `governance` | package.json:scripts['map:mandala']             |
| `pnpm maps:validate`           | Prüft Karten-/Indexdateien via scripts/maps/validate-maps.mjs.                                                            | `mapping` `validation` | package.json:scripts['maps:validate']           |
| `pnpm maps:build`              | Generiert Repository-Karten mittels scripts/repo-map.ts (run-dist).                                                       | `mapping` `automation` | package.json:scripts['maps:build']              |
| `pnpm maps:list`               | Listet Einträge aus analysis/repo-map.json (Node-Einzeiler).                                                              | `mapping` `inspection` | package.json:scripts['maps:list']               |
| `pnpm fraktalrun:import`       | Importiert Fraktal-Laufdaten via scripts/fraktalrun-import.ts (Dist-Runner).                                              | `fraktal` `governance` | package.json:scripts['fraktalrun:import']       |

## Sigillin, Emergenz & Resonanz

_Stewards:_ CodexAuditAgent, EvolverGPT

| Command                    | Description                                                                                            | Tags                     | Source                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------- |
| `pnpm sigils:lint`         | Validiert Sigils via scripts/sigils-validate.ts (Dist-Runner).                                         | `sigils` `lint`          | package.json:scripts['sigils:lint']         |
| `pnpm sigils:index`        | Baut den Sigillin-Index über scripts/build-sigillin-index.mjs.                                         | `sigils` `index`         | package.json:scripts['sigils:index']        |
| `pnpm sigils:index:strict` | Strenger Sigillin-Lauf (find-bad-yaml, sigils:scan, stac:validate, sigils:index).                      | `sigils` `ci`            | package.json:scripts['sigils:index:strict'] |
| `pnpm sigils:scan`         | Scannt Sigillin-Dateien via scripts/validate-sigils.ts (Dist).                                         | `sigils` `validation`    | package.json:scripts['sigils:scan']         |
| `pnpm sigils:errors`       | Zeigt out/sigils_errors.json an oder meldet 'no errors file'.                                          | `sigils` `inspection`    | package.json:scripts['sigils:errors']       |
| `pnpm validate:sigillins`  | Validiert Sigillin-Bridges anhand von scripts/validate-sigillins.mjs und mandala-sigillin.schema.json. | `sigils` `schema`        | package.json:scripts['validate:sigillins']  |
| `pnpm sigillins:scaffold`  | Gerüstet Inter-AI-Bridges mittels scripts/scaffold-interai-bridges.mjs.                                | `sigils` `scaffolding`   | package.json:scripts['sigillins:scaffold']  |
| `pnpm sigillins:authoring` | CLI zur Erstellung/Bearbeitung von Bridges (scripts/sigillin-authoring.mjs).                           | `sigils` `cli`           | package.json:scripts['sigillins:authoring'] |
| `pnpm sigillins:build`     | Packt Sigillin-Archive via scripts/build-sigillin-archive.mjs.                                         | `sigils` `archive`       | package.json:scripts['sigillins:build']     |
| `pnpm emergence:scan`      | Verknüpft sigils:index und agents:scan zur Emergenzanalyse.                                            | `emergence` `agents`     | package.json:scripts['emergence:scan']      |
| `pnpm resonance:calc`      | Berechnet Resonanzmetriken via scripts/resonance-calc.ts (run-dist).                                   | `resonance` `metrics`    | package.json:scripts['resonance:calc']      |
| `pnpm graph:build`         | Erstellt Sigillin-Graphen mittels scripts/build-sigillin-graph.mjs.                                    | `sigils` `graph`         | package.json:scripts['graph:build']         |
| `pnpm generate:next-sigil` | Erzeugt nächste Sigillin-Vorlagen via scripts/generate-next-sigil.js.                                  | `sigils` `generation`    | package.json:scripts['generate:next-sigil'] |
| `pnpm agents:run`          | Allgemeiner Agentenrunner (scripts/agents/runner.ts) für orchestrierte Ausführungen.                   | `agents` `orchestration` | package.json:scripts['agents:run']          |
| `pnpm agents:scan`         | Emergenzscan der Agenten (scripts/agents/emergence-scan.ts).                                           | `agents` `emergence`     | package.json:scripts['agents:scan']         |
| `pnpm agents:test:golden`  | Führt Golden-File-Tests für Agenten via scripts/agents/golden-runner.ts aus.                           | `agents` `testing`       | package.json:scripts['agents:test:golden']  |
| `pnpm agents:route`        | Interaktive Router-CLI (scripts/agents/router.mjs) für Agentenpfad-Tests.                              | `agents` `cli`           | package.json:scripts['agents:route']        |

## Datenpipelines & Ingestion

_Stewards:_ Climate Lab, Resonance Lab

| Command                       | Description                                                                                   | Tags                        | Source                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------- |
| `pnpm adapter:build:era5`     | Generiert synthetische ERA5-Daten (Python Fixture) und führt adapter-postprocess.mjs aus.     | `adapters` `era5`           | package.json:scripts['adapter:build:era5']     |
| `pnpm adapter:build:oisst`    | Baut den OISST-Adapter über scripts/build-adapter-oisst.mjs.                                  | `adapters` `oisst`          | package.json:scripts['adapter:build:oisst']    |
| `pnpm adapter:build:effis`    | Erzeugt Effis-Adapter-Artefakte via scripts/build-adapter-effis.mjs.                          | `adapters` `effis`          | package.json:scripts['adapter:build:effis']    |
| `pnpm scan:ingest`            | Durchsucht externe Ingest-Pfade via scripts/ingest-external-scan.mjs.                         | `ingest` `scan`             | package.json:scripts['scan:ingest']            |
| `pnpm stac:validate`          | Validiert STAC-Kollektionen über scripts/validate-stac.mjs.                                   | `stac` `validation`         | package.json:scripts['stac:validate']          |
| `pnpm stac:validate:item`     | Validiert einzelne STAC-Items via scripts/validate-stac.ts (run-dist) und Fixturepfad.        | `stac` `validation`         | package.json:scripts['stac:validate:item']     |
| `pnpm split:conversations`    | Teilt Konversationsdatensätze mittels scripts/split-conversations.js.                         | `conversations` `data`      | package.json:scripts['split:conversations']    |
| `pnpm grep:conversations`     | Filtert Konversationen (node scripts/filter-conversations.js).                                | `conversations` `data`      | package.json:scripts['grep:conversations']     |
| `pnpm analyze:conversations`  | Analyisiert Konversationsstreams via scripts/analyze-conversations.js.                        | `conversations` `analytics` | package.json:scripts['analyze:conversations']  |
| `pnpm parse:newconversations` | Parst New-Advanced-Konversationen (scripts/parse-newadvanced-conversations.js).               | `conversations` `data`      | package.json:scripts['parse:newconversations'] |
| `pnpm conversations:grep`     | Dist-First Parser für new advanced conversations (scripts/parse-newadvancedconversations.ts). | `conversations` `cli`       | package.json:scripts['conversations:grep']     |

## Backlog, Feedback & Automatisierung

_Stewards:_ Repositorypflege Collective, PatternReactivator

| Command                         | Description                                                                          | Tags                    | Source                                           |
| ------------------------------- | ------------------------------------------------------------------------------------ | ----------------------- | ------------------------------------------------ |
| `pnpm update:advanced-todo`     | Synchronisiert advancedToDo Listen über scripts/update-advanced-todo.js.             | `automation` `backlog`  | package.json:scripts['update:advanced-todo']     |
| `pnpm update:code-todos`        | Aktualisiert ToDo-Kommentare mit scripts/update-code-todos.cjs.                      | `automation` `backlog`  | package.json:scripts['update:code-todos']        |
| `pnpm update:newadvanced-todo`  | Pflegt new advanced TODO Artefakte via scripts/update-newadvanced-todo.js.           | `automation` `backlog`  | package.json:scripts['update:newadvanced-todo']  |
| `pnpm update:fractal-todo`      | Aktualisiert Fraktal TODO Manifeste (scripts/update-fractal-todo.js).                | `automation` `fractal`  | package.json:scripts['update:fractal-todo']      |
| `pnpm update:todo-sigil`        | Verknüpft TODOs mit Sigillin-Metadaten (scripts/update-todo-sigil.js).               | `sigils` `backlog`      | package.json:scripts['update:todo-sigil']        |
| `pnpm update:advanced-progress` | Aktualisiert advancedprogress.json via repositorypflege/update-advanced-progress.js. | `automation` `progress` | package.json:scripts['update:advanced-progress'] |
| `pnpm generate:initial-tasks`   | Erzeugt Startaufgaben durch repositorypflege/generate-initial-tasks.js.              | `automation` `tasks`    | package.json:scripts['generate:initial-tasks']   |
| `pnpm validate:todos`           | Validiert implizite Todos mit scripts/validate-implicit-todos.js.                    | `validation` `backlog`  | package.json:scripts['validate:todos']           |
| `pnpm validate:advancedtodo`    | Prüft advanced ToDo-Listen via scripts/validate-advancedtodo.js.                     | `validation` `backlog`  | package.json:scripts['validate:advancedtodo']    |
| `pnpm store:commit-memory`      | Persistiert Agenten-Memory über GenesisAeonZIPMEM/commitMemory/commit-memory.js.     | `memory` `agents`       | package.json:scripts['store:commit-memory']      |

## Dokumentation & Dashboards

_Stewards:_ VisionContextIntegrator, DevX Guild

| Command                  | Description                                                                                              | Tags                 | Source                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------- |
| `pnpm docs:build`        | Erzeugt Typedoc-Dokumentation für TypeScript-Pakete.                                                     | `docs` `typedoc`     | package.json:scripts['docs:build']        |
| `pnpm docs:auto`         | Generiert API-Dokumentation automatisch via scripts/generate-api-docs.js.                                | `docs` `automation`  | package.json:scripts['docs:auto']         |
| `pnpm trikaya:dashboard` | Erstellt Trikāya-Dashboards (analysis/trikaya-dashboard.\*) über scripts/generate-trikaya-dashboard.mjs. | `dashboard` `sigils` | package.json:scripts['trikaya:dashboard'] |

## Plattform-Werkzeuge & Direktaufrufe

_Stewards:_ Dev Infrastructure, SyncRunner

| Command                                        | Description                                                                                                | Tags                       | Source                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------- |
| `node scripts/run-dist.mjs <source> [...args]` | Dist-First Runner: validiert Source-Pfade, prüft dist-Artefakte und startet Node mit --enable-source-maps. | `dist-first` `cli`         | scripts/run-dist.mjs            |
| `node scripts/dev-services.mjs --mode=prod`    | Direkter Aufruf für Service-Orchestrierung im Produktionsmodus (setzt dist/ Artefakte voraus).             | `services` `orchestration` | scripts/dev-services.mjs        |
| `./scripts/setup-unifiedmandala.sh`            | Schnelles Bootstrap-Skript (apt, pnpm install, poetry install) für Unified-Mandala-Umgebungen.             | `setup` `bootstrap`        | scripts/setup-unifiedmandala.sh |
| `./scripts/setup-mtls.sh`                      | Erzeugt selbstsignierte Zertifikate (certs/server.{crt,key}) für MTLS-Tests.                               | `mtls` `certificates`      | scripts/setup-mtls.sh           |
| `./scripts/setup-kong-jwt.sh`                  | Platzhalter-Skript für KONG JWT Gateway-Konfiguration (Echo).                                              | `kong` `placeholder`       | scripts/setup-kong-jwt.sh       |
| `pnpm dlx tsx scripts/setup-wizard.ts`         | Interaktiver Setup-Wizard für Spaces/Peers (derzeit Mock-Ausgaben).                                        | `wizard` `cli`             | scripts/setup-wizard.ts         |
| `pnpm dlx tsx scripts/js-setup.ts`             | Initialisiert NATS JetStream Streams anhand von Umgebungsvariablen.                                        | `nats` `infrastructure`    | scripts/js-setup.ts             |
