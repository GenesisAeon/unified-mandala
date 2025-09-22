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

- TypeScript-Checks: `pnpm typecheck`
- Unit-Tests: `pnpm test:unit`
- Coverage: `pnpm test:unit:coverage` (Artefakt `coverage-vitest`)
- JetStream-Test: `pnpm test:jetstream` (erfordert lokalen oder Docker-NATS)

### Governance / Meta-Jobs

- Schema-Validierung: `pnpm schema:validate` (MandalaMap & Codexfeedback)
- Maps-Validierung: `pnpm maps:validate`
- Policy-Suite: `pnpm policy:check`
  - Optional-Schritte (Kyverno, Sigillin) überspringen bei fehlenden Tools automatisch; `PANTHEON_DISABLE=1` wird gesetzt
- Repo-Sanity: `pnpm sanity` (prüft MandalaMap/Trikāya-Hooks & Codexfeedback)
- Repo-Map: `pnpm repomap:build && pnpm repomap:validate`
  - Fällt auf Fallback-Artefakte zurück, falls `run-dist` nicht verfügbar ist

### Meta-Bundles

- `pnpm check:ci` bündelt TypeScript-Emit, `pnpm nats:doctor`, `pnpm test:ts:ci`, `pnpm test:jetstream` und `npx pyright`
- `pnpm ci:verify` kombiniert `pnpm test:ts`, `pnpm sigils:index:strict` sowie `pnpm adapter:build:era5` für einen strengen Release-Drill

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
- Monitoring optional: `docker compose --profile monitoring up` (Prometheus 9090, Grafana 3000)
- Smoke-Tests vor Präsentationen: `pnpm smoke:ui`, `pnpm smoke:light-static`
- Monitoring-Check: `curl http://localhost:9090/api/v1/targets` validiert Prometheus-Ziele

## Hinweise & Ressourcen

- Stabilization-Playbook: `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`
- MandalaMap-Übersicht: `MandalaMap.(md|json|yaml)`
- Trikāya-Dashboard: `analysis/trikaya-dashboard.(md|json|yaml)`
- Command-Katalog: `docs/runbooks/command-catalog.(md|json|yaml)`

Bleibe beim Dist-First-Ansatz: Produktionsskripte laufen über `node dist/...` (via `scripts/run-dist.mjs`). Für weiterführende Schritte siehe die Codexfeedback-Hooks im Repository.
