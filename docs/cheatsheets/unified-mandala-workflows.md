# Unified Mandala Workflow Cheat Sheet

Dieses Cheat Sheet fasst die Kernabläufe für das Unified-Mandala-Repo zusammen. Es dient als schnelle Referenz für lokale Entwicklung, CI/CD, Datenadapter, Governance und Demo-/Pitch-Vorbereitung. Alle Befehle sind PNPM-basiert (Node 20) und respektieren den Dist-First-Ansatz.

## 1. Lokale Entwicklung

### Umgebung vorbereiten

- Node-Version prüfen (`node -v`, erwartet ≥ 20) und Corepack aktivieren: `corepack enable`
- Abhängigkeiten installieren: `pnpm install --frozen-lockfile`
- `.env` aus `.env.example` ableiten, falls noch nicht vorhanden
- Windows: `pwsh -NoProfile -File ./scripts/setup-dev-env.ps1` richtet die Toolchain ein und exportiert den Installationsstatus (`out/setup/install-state.json`).

### UI & Stack starten

- Nur UI: `pnpm dev:ui` → Vite-Server auf Port 5173
- Komplettes Stack (UI + Services + API + NATS): `pnpm dev:stack`
  - Belegt Ports werden automatisch freigeräumt (`pnpm dlx kill-port ...`); Opt-out via `UM_DEV_SERVICES_AUTOFREE_PORTS=0`
- Ports hart aufräumen: `pnpm dev:ports:free`

### AI Bridge testen

- Responses-Wrapper lokal prüfen: `pnpm -F @unified-mandala/ai dev`
- NATS-Worker starten (Request/Reply auf `ai.request`): `pnpm -F @unified-mandala/ai nats`
- Express-API mit `/api/ai/chat` hochfahren: `pnpm -F @unified-mandala/api dev`
- Optional: `AI_TRANSPORT=nats` setzen, um HTTP-Aufrufe über den Worker zu routen.

### JetStream / NATS

- Lokalen NATS-Server per Docker starten: `pnpm nats:docker up`
- Alternative: `docker run --rm -p 4222:4222 -p 8222:8222 nats:latest -js`
- Diagnose: `pnpm nats:doctor` (prüft JetStream, weist auf fehlendes `-js`, Firewall, Rechte hin)

### Statische UI

- Produktions-Build: `pnpm build:ui`
- Light-Server für Offline-Demo: `pnpm start:light` (Port 3000)
- UI-Smoke-Test: `pnpm smoke:ui` (gegen laufende Dev-Instanz)

### Hilfsbefehle & Ports

- Automatisches Port-Freiräumen: `pnpm dev:stack` nutzt `pnpm dlx kill-port`; Opt-out via `UM_DEV_SERVICES_AUTOFREE_PORTS=0`
- Manuell Ports freigeben: `pnpm dev:ports:free`
- Setup-Skripte: `scripts/setup-dev-env.sh` (Unix) bzw. `scripts/setup-dev-env.ps1` (Windows)

## 2. CI/CD & Tests

### Lint & Typing

- ESLint: `pnpm lint:eslint`
- Prettier-Check: `pnpm format:check`
- TypeScript ohne Emit: `pnpm typecheck`
- Python-Typen prüfen: `npx pyright`

### Core-Gates

- GitHub Workflow `ci.core.yml` (Job _type_and_tests_) führt auf PRs/Pushes automatisch aus:
  - `pnpm typecheck` (TypeScript ohne Emit)
  - `pnpm lint:eslint`
  - `pnpm -F @unified-mandala/api build`
  - `pnpm test:unit:coverage` (Artefakt `coverage-vitest` wird hochgeladen)
  - `pnpm schema:validate`
  - `pnpm maps:validate`
  - `pnpm sanity`
  - `pnpm policy:check`
- JetStream-Test: `pnpm test:jetstream` (erfordert lokalen oder Docker-NATS)

### Provenance & Label-Gates

- GitHub-Workflow `auto-provenance.yml` vergibt automatisch ein `source:*` Label (human, human-docs, mandala-ai, external-ai).
- `provenance-gate.yml` blockiert PRs mit fehlendem oder falschem `source:*` Label und schützt `packages/**/core`, Guard-Skripte sowie Deploy-/Infra-Verzeichnisse.
- Slash-Commands: `/run repomap` hängt das Label `run:repomap` an, `/run governance` aktiviert das Advisory-Label `ci:advisory` (Workflow `on-demand.yml`).
- Runtime-Lane: `ci.runtime.yml` startet NATS + AI-Smoketest, ausgelöst durch Label `ci:runtime`.
- Labels initialisieren oder aktualisieren: `pnpm labels:setup` (ruft `scripts/repo/setup-labels.mjs` via GitHub CLI `gh` auf).
- Quickstart + Two-Plane/Label-Matrix: siehe `docs/START-HERE.md` (Golden Path, scratch:// vs repo://, Label-Übersicht).

### Governance / Meta-Jobs

- CI-Core deckt Schema-, Map-, Sanity- und Policy-Suite bereits ab; für manuelle Läufe:
  - `pnpm schema:validate`
  - `pnpm maps:validate`
  - `pnpm sanity`
  - `pnpm policy:check` (Kyverno/Sigillin-Schritte werden bei fehlenden Tools mit Warnung übersprungen, `PANTHEON_DISABLE=1` schützt Analytics)
- Repo-Map: `pnpm repomap:build && pnpm repomap:validate`
  - Fällt auf Fallback-Artefakte zurück, falls `run-dist` nicht verfügbar ist
- Advisory-Lane: Label `ci:advisory` triggert weiterhin das optionale Bundle `pnpm check:ci` (Soft-Fail) für aggregierte Ausgaben.

### Meta-Bundles

- `pnpm check:precommit` spiegelt die Husky-Gates: `pnpm lint-staged`, `pnpm typecheck`, `pnpm test:unit`, Schema/Maps/Repo-Map (`pnpm schema:validate`, `pnpm maps:validate`, `pnpm repomap:build`, `pnpm repomap:validate`), `pnpm sanity` und `pnpm policy:check`. Setze `UM_SKIP_HEAVY_HOOKS=1`, um nur `lint-staged` auszuführen.
- `pnpm check:prepush` führt `pnpm test:unit:coverage` sowie `pnpm policy:check` mit `PANTHEON_DISABLE=1` aus.
- `pnpm check:ci` fasst die Kern-Gates für PRs zusammen: `pnpm typecheck`, `pnpm test:unit`, `pnpm schema:validate`, `pnpm maps:validate`, `pnpm repomap:build`, `pnpm repomap:validate`, `pnpm sanity` und `pnpm policy:check`.
- `pnpm ci:verify` ruft das Skript `scripts/ci-verify.mjs` auf (Typecheck, Unit-Tests, Coverage, Schema/Map/Repo-Sanity und Policy-Suite) – identisch mit dem GitHub-Workflow `ci:verify`.
- GitHub-Workflow `ai-commit-guard.yml` führt `node scripts/ci/ai-commit-guard.mjs` aus, blockiert `.ai-scratch/`-Artefakte, verhindert Bot-Pushes auf `main` und erinnert PRs an das Two-Plane-Modell (CODE ↔ RUNTIME).
- GitHub-Workflow `status-gate.yml` reagiert auf das Label **ready-to-merge** (oder manuellen `workflow_dispatch`), prüft Draft, ReviewDecision, Mergeability sowie den Status-Rollup und aktiviert Auto-Merge/Merge Queue nur bei vollständig grünen Checks; scheitert ein Gate, wird das Label automatisch entfernt.

### Python & Adapter-Abhängigkeiten

- Für Offline-Builds installiert CI `src/adapters/requirements.txt` (netCDF4, h5netcdf, scipy)
- `PANTHEON_DISABLE=1` hält Analytics in Tests deaktiviert

## 3. Datenadapter & STAC

- ERA5: `pnpm adapter:build:era5`
- OISST: `pnpm adapter:build:oisst`
- EFFIS: `pnpm adapter:build:effis`
- STAC-Validierung: `pnpm stac:validate`
- Tests sichern relative/absolute HREFs (`tests/adapters/test_stac_paths.py`)

## 4. Governance & Policy-Checks

- Policy-Suite orchestriert OPA, Guardrails, Kyverno (optional) und Sigillin-Reports; fehlende Kyverno-CLI oder `sigillins:report`-Skripte werden als Skip mit Warnung protokolliert
- Reports landen unter `out/policy/` (JSON, Markdown, JUnit)
- Sigillin-Validierung gezielt: `pnpm validate:sigillins` bzw. `pnpm validate:sigillins:changed`
- Governance-Reports: `pnpm sigillins:report` erzeugt Markdown/JUnit-Ausgaben unter `out/policy/sigillins/`
- Sigillin-Autor\*innen: `pnpm sigillins:authoring` bzw. `pnpm sigillins:scaffold` erzeugen neue Brücken/Vorlagen
- Policy-Dokumentation: `AI_POLICY.md`, `AI_POLICY.yaml`, `docs/governance/policy-suite.md`

## 5. Demo & Pitch Vorbereitung

- Statische UI für Offline-Demos: `pnpm build:ui` → `pnpm start:light`
- Komplettsystem lokal: `pnpm dev:stack` oder `pnpm start:all` (nach NATS-Start)
- Offline-Bundle via Docker: `docker compose -f docs/offline/docker-compose.yml build` & `docker compose -f docs/offline/docker-compose.yml up`
- Monitoring optional: `docker compose --profile monitoring up` (Prometheus 9090, Grafana 3300)
- Smoke-Tests vor Präsentationen: `pnpm smoke:ui`, `pnpm smoke:light-static`
- Monitoring-Check: `pnpm observability:check` nutzt Prometheus `/api/v1/targets` und Grafana `/api/health`; alternativ `curl http://localhost:9090/api/v1/targets`

## Hinweise & Ressourcen

- Stabilization-Playbook: `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`
- MandalaMap-Übersicht: `MandalaMap.(md|json|yaml)`
- Trikāya-Dashboard: `analysis/trikaya-dashboard.(md|json|yaml)`
- Command-Katalog: `docs/runbooks/command-catalog.(md|json|yaml)`

Bleibe beim Dist-First-Ansatz: Produktionsskripte laufen über `node dist/...` (via `scripts/run-dist.mjs`). Für weiterführende Schritte siehe die Codexfeedback-Hooks im Repository.
