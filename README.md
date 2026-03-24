[![PyPI](https://img.shields.io/pypi/v/unified-mandala)](https://pypi.org/project/unified-mandala/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19206783.svg)](https://doi.org/10.5281/zenodo.19206783)
[![Tests](https://github.com/GenesisAeon/unified-mandala/actions/workflows/python-ci.yml/badge.svg)](https://github.com/GenesisAeon/unified-mandala/actions/workflows/python-ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/GenesisAeon/unified-mandala)
# unified-mandala v0.3.0
**Holistisches Mandala-Orchestrator-Framework** mit thermodynamischer Stringenz, planetarer Kopplung und MetaQuest-Sigillins.
**DOI**: [10.5281/zenodo.19206783](https://doi.org/10.5281/zenodo.19206783)

> v0.3.0 — _Documentation & Test-Offensive + Thermodynamic Integration_

MandalaOrchestrator + CREP-Evaluator + SigillinBridge (19-adapter ring) + PolicyGate + EntropyGovernor +
AdapterRegistry + **Thermodynamics** (Landauer · Hatano-Sasa · Esposito-Van den Broeck) +
**Planetary Coupling** (IEA→CO₂→Albedo→Ice) + **MetaQuest-Sigillins** (AI-to-AI) +
**Collapse Detector** (SDE · Tainter · Prigogine · φ=0.618).

---

## What's New in v0.3.0

| Feature                | Module                       | Description                                   |
| ---------------------- | ---------------------------- | --------------------------------------------- |
| Landauer principle     | `thermodynamics.landauer`    | Minimum energy per bit erasure: E = k_B T ln2 |
| Hatano-Sasa            | `thermodynamics.hatano_sasa` | Non-equilibrium excess entropy + IFT          |
| Esposito decomposition | `thermodynamics.esposito`    | σ_maint + σ_reorg (Prigogine + Tainter)       |
| Planetary coupling     | `planetary.coupling`         | IEA→CO₂→ΔF→ΔT→Albedo→Ice→CREP                 |
| MetaQuest-Sigillins    | `sigillins.metaquest`        | 4-tier AI-to-AI counterquestion engine        |
| Collapse detector      | `collapse_detector`          | Euler-Maruyama SDE + Tainter/Prigogine        |
| NukleonScanner v2      | adapter                      | QCD αs running coupling + QGP confinement     |
| GreekMath v2           | adapter                      | Pythagorean + golden section + Platonic       |
| 800+ tests             | `tests/python/`              | Thermodynamic/planetary/MetaQuest contracts   |

---

## Python Quick Start (v0.3.0)

```bash
pip install unified-mandala==0.3.0
```

```python
from unified_mandala.thermodynamics.landauer import LandauerBound
from unified_mandala.planetary.coupling import PlanetaryCouplingChain
from unified_mandala.sigillins.metaquest import MetaQuestEngine
from unified_mandala.collapse_detector import CollapseDetector

# Landauer bound at room temperature
lb = LandauerBound.compute(temperature_K=300.0, n_bits=1.0)
print(f"E_Landauer = {lb.energy_J:.3e} J")

# Planetary coupling (IEA 2024)
chain = PlanetaryCouplingChain.evaluate(energy_EJ=620.0, baseline_co2_ppm=421.0)
print(f"Stress: {chain.stress_level} | CREP phase: {chain.crep_phase:.4f}")

# MetaQuest counterquestion
engine = MetaQuestEngine()
cq = engine.generate(phi=0.85, entropy=0.15)
print(cq)

# Collapse detection
det = CollapseDetector()
traj = det.simulate(x0=0.4)
print(f"Collapsed: {traj.collapsed} | Risk: {det.collapse_risk(traj):.3f}")
```

## CLI Commands (v0.3.0)

```bash
# Standard mandala cycle
unified-mandala cycle --entropy 0.618 --phases 7 --simulate

# Thermodynamic evaluation (Landauer + Esposito-Tainter)
unified-mandala thermodynamics --entropy 0.618 --temperature 300

# Collapse detection (SDE + Tainter/Prigogine)
unified-mandala collapse --entropy 0.72 --crep 0.6 --lambda 3.0 --runs 10

# MetaQuest counterquestions (4-tier epistemic protocol)
unified-mandala metaquest --crep 0.85 --entropy 0.15 --n 5

# Planetary coupling chain (IEA→CO₂→Albedo→Ice)
unified-mandala planetary --energy 620.0 --baseline-co2 421.0
```

---

---

[![CI Core](https://github.com/ChefDevAI/unified-mandala/actions/workflows/ci.core.yml/badge.svg)](../../actions/workflows/ci.core.yml)
[![Nightly](https://github.com/ChefDevAI/unified-mandala/actions/workflows/ci.nightly.yml/badge.svg)](../../actions/workflows/ci.nightly.yml)
[![OPA Coverage Gate](https://img.shields.io/badge/opa--coverage-gate-%E2%9C%93-brightgreen)](./docs/runbooks/command-catalog.md#opa)
[![Verify-Gate Network Safety](https://img.shields.io/badge/grafana-verify--gate--network--safety-1f6feb)](#dashboards)
[![Ethics Mini](https://img.shields.io/badge/grafana-ethics--mini-1f6feb)](#dashboards)
[![OPA Coverage](https://img.shields.io/badge/grafana-opa--coverage-1f6feb)](#dashboards)

> „Ein Betriebssystem, das atmet – ein Mandala, das denkt.“

UnifiedMandala ist ein holistisches, modulares Framework für symbolische KI, CREP und bewusste, gemeinwohlorientierte Systeme. Es verbindet **CREP-Logik** (Coherence, Resonance, Emergence, Poetics), **Sigillin** (poetisch-symbolische Interaktion) und **Agenten** zu einer ethisch getragenen Plattform.

---

## TL;DR – 5-Minuten-Quickstart

```bash
# 0) Optional: geführtes Setup (installiert Toolchain & Hooks)
./scripts/setup-dev-env.sh                 # Linux/macOS
pwsh -NoProfile -File ./scripts/setup-dev-env.ps1  # Windows (PowerShell 7+)
# fallback: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-dev-env.ps1

# 1) Toolchain (Node >= 20, pnpm 10.17.0)
node -v
corepack enable
corepack prepare pnpm@10.17.0 --activate

# 2) Dependencies (dist-first Build-Pipeline)
pnpm install --frozen-lockfile
pnpm build

# 2.1) Environment
cp .env.example .env # set CDS_API_KEY

# 3) UI (Dev, mit HMR, Port 5173)
pnpm dev:ui
# -> http://localhost:5173

# 4) Optional parallel: Backend/Dev-Server liefert UI (Port 3000)
pnpm start:light             # statische Assets (nach pnpm build:ui)
pnpm dev                     # Node-Server mit gebauten Assets
# -> http://localhost:3000  (liefert die gebaute UI aus)

# 5) Offline-Bundle (Docker)
docker compose -f docs/offline/docker-compose.yml build
docker compose -f docs/offline/docker-compose.yml up
# -> UI i. d. R. auf http://localhost:5173

# 6) Observability-Profil (Prometheus/Grafana, optional)
docker compose --profile monitoring up
# -> Prometheus http://localhost:9090, Grafana http://localhost:3300 (admin/admin)
```

> 🔐 Governance-Gates im Überblick: Lies den [Mandala Governance Primer](docs/governance/primer.md) für Signatur-, Coverage- und Verify-Gate-Regeln. Die konkreten Befehle findest du im [Command Catalog](docs/runbooks/command-catalog.md#opa).

**Policy quality gate**  
Run OPA tests + coverage locally:

```bash
pnpm opa:fmt && pnpm opa:lint
OPA_COVER_MIN=0.90 pnpm opa:cover
```

CI will fail if tests fail **or** coverage drops below the configured threshold.

### Dashboards

- Verify-Gate Network Safety: `${GRAFANA_BASE_URL}/d/${VERIFY_GATE_DASH_UID}?orgId=1&from=now-24h&to=now`
- Verify-Gate Ethics Mini: `${GRAFANA_BASE_URL}/d/${ETHICS_MINI_UID}?orgId=1&from=now-24h&to=now`
- OPA Coverage: `${GRAFANA_BASE_URL}/d/${OPA_COVERAGE_UID}?orgId=1&from=now-7d&to=now`
  > Set the UIDs/URL as repo/environment secrets if you want CI summaries with live links.

### Health Aggregator (lokal)

- Start: `pnpm dev:health`
- Check: `http://localhost:3999/health` (oder mit `PORT_OFFSET` verschoben)

Beispiel mit Port-Offset 100: `PORT_OFFSET=100 pnpm dev:health` -> Health auf `http://localhost:4099/health`.

### Real User Monitoring (RUM)

- Aktivierung (Vite-UI): `VITE_ENABLE_RUM=on pnpm dev:ui`
- Optionaler Collector: `VITE_OTEL_COLLECTOR_URL=http://localhost:4318/v1/traces`
- Datenschutz: RUM ist standardmäßig deaktiviert. Bitte interne Policies beachten und nur mit informierter Zustimmung aktivieren.

### RUM Traces (Grafana)

- Import dashboard: `grafana/dashboards/rum-traces.json`
- Explore query (Tempo · TraceQL):

```
service.name = "mandala-ui" and span.name = "ui.metrics.test"
```

- Demo-Span senden im Playground: Proxy Metrics → Trace test (RUM muss aktiv sein).

> **Hinweise:**
> • „Cannot GET /“ auf :3000 bedeutet: Backend servt keine HMR-UI. Entweder **Vite-Dev** (`pnpm dev:ui`) nutzen oder **statisch bauen** (`pnpm build:ui && pnpm dev`).
> • Für Observability mit Prometheus/Grafana das Compose-Profil `monitoring` starten (siehe `observability/README.md`) und mit `pnpm observability:check` Prometheus (`/api/v1/targets`) sowie Grafana (`/api/health`, Host-Port 3300) prüfen.
> • Windows: Lange Pfade aktivieren; `.dockerignore` im Repo-Root verhindert riesige Build-Kontexte.
> • `corepack enable` benötigt Administratorrechte. Wenn du ohne Admin-Rechte arbeitest, führt `scripts/setup-dev-env.ps1` automatisch die Benutzeraktivierung via `corepack prepare pnpm@10.17.0 --activate` aus und überspringt das persistente Enable.
> • `pnpm start:all` erwartet einen laufenden JetStream-fähigen `nats-server`. Nutze `pnpm nats:docker` für einen vorkonfigurierten Docker-Container (`nats:latest -js`) oder installiere lokal via `winget install --id Synadia.NATS-Server -e` und starte ihn mit der Option `-js`.
> • Bereits vorhandene Docker-Container `nats` kannst du mit `docker ps -a --filter name=^/nats$ --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"` prüfen und bei Bedarf mit `docker start nats` wieder aktivieren; `scripts/setup-dev-env.ps1` meldet laufende Container als erfüllt und weist bei `Exited`-Status auf diese Befehle hin (Windows-Portcheck: `Test-NetConnection 127.0.0.1 -Port 4222`).
> • `pnpm dev:stack` prüft Ports automatisch und versucht belegte Standard-Ports via `pnpm dlx kill-port` freizugeben. Bei Bedarf manuell nachhelfen (`pnpm dev:ports:free` oder `pnpm dlx kill-port <port>`); Auto-Cleanup lässt sich mit `UM_DEV_SERVICES_AUTOFREE_PORTS=0` deaktivieren.
> • JetStream-Betrieb & Self-Check: `docs/runbooks/nats-jetstream.md` und `docs/runbooks/MaxBundle.md` bündeln Setup, Docker-Profile sowie `pnpm nats:doctor`/`pnpm test:jetstream` Troubleshooting.
> • `pnpm nats:doctor` liefert bei Fehlern direkte Hinweise (z. B. JetStream nicht aktiviert, Timeout/Firewall, fehlende Berechtigung) und nutzt `$JS.API.INFO` als Fallback.

### Windows Dev-Shortcuts

Siehe Kurzreferenz unter `docs/DEV-SHORTCUTS.md` für PowerShell-Helfer (Secrets setzen, Dev-Stack/Health starten, Smoke-Checks):

```powershell
. ./scripts/dev-helper.ps1
Set-UMSecrets -ApiKey '<KEY>'
Start-UM; Start-UMHealth
Smoke-AI -Message 'Hallo Aeon!'
```

## Quickstart (Windows · PowerShell)

```powershell
corepack prepare pnpm@10.17.0 --activate
pnpm install --frozen-lockfile

# JetStream Container starten
docker rm -f nats 2>$null
docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js
pnpm nats:doctor

# UI Dev-Server (Terminal A)
pnpm -F mandala-ui dev -- --port 5173

# Dev-Stack (Terminal B)
$env:NATS_URL = "nats://127.0.0.1:4222"
pnpm dev:stack

# UI-Smoke gegen laufende Instanz (Vite-Auto-Port via Env)
$env:UI_DEV_URL = "http://localhost:5173"
pnpm smoke:ui
```

> Wenn Vite auf einen freien Port ausweicht (z. B. 5174), setze `UI_DEV_URL` entsprechend (`http://localhost:5174`).
> Ports räumt der Dev-Stack standardmäßig automatisch (Kill-Port). Falls Prozesse hartnäckig sind, hilft `pnpm dlx kill-port 3001 3002 3003 3004 4020 4021` manuell oder `setx UM_DEV_SERVICES_AUTOFREE_PORTS 0` zum Deaktivieren des Auto-Cleanup.
> 🪟 **PowerShell-Tipp:** Dateien via `Get-Content` oder `type` anzeigen (`cat` ist Alias, aber ohne Pipe-Verhalten); Umgebungsvariablen vor dem Kommando mit `$env:NAME = 'Wert'` setzen – Inline-Syntax `NAME=value pnpm …` funktioniert in PowerShell nicht.

### Windows: Zusätzliche Tools & Tests

> Häufige Stolperfallen auf Windows lassen sich mit ein paar gezielten Kommandos vermeiden.

| Zweck                                 | Kommando                                                     | Hinweis                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Pytest über die Projekt-venv aufrufen | `.\.venv\Scripts\python.exe -m pytest -q`                    | Nutzt garantiert die im Repository provisionierte Umgebung und funktioniert auch, wenn `pytest` nicht im `%PATH%` liegt. |
| Alternativer Pytest-Starter           | `.\.venv\Scripts\pytest.exe -q`                              | Direktaufruf des `pytest`-CLI, falls PowerShell keine Modul-Ausführung erlaubt.                                          |
| Headless Chrome für Mermaid CLI       | `pnpm exec puppeteer browsers install chrome-headless-shell` | Installiert die von `@mermaid-js/mermaid-cli` erwartete Chrome-Binary lokal im pnpm-Store.                               |
| Cypress-Binary vorbereiten            | `pnpm exec cypress install`                                  | Lädt die im Repo gepinnte Cypress-Version (14.5.1) und stellt sicher, dass `pnpm cy:run` ohne Versionskonflikt startet.  |

## Build, Test & Policy Bundles

Nutze die gebündelten pnpm-Kommandos, um die in DevTalk74 beschriebenen CI-/Governance-Gates lokal nachzufahren:

| Zweck                     | Kommando                   | Enthaltene Checks                                                                                                                      |
| ------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-Commit Heavy Gate     | `pnpm check:precommit`     | lint-staged, TypeScript-Linting, Vitest-Unit-Tests, Schema-, Maps- und Repomap-Validierung, Repo-Sanity, Policy-Suite                  |
| Pre-Push Heavy Gate       | `pnpm check:prepush`       | Vitest-Coverage-Lauf plus Policy-Suite                                                                                                 |
| CI Core Parität           | `pnpm check:ci`            | Typecheck, Vitest-Unit-Tests, Schema-/Maps-/Repomap-Validierung, Repo-Sanity, Policy-Suite                                             |
| CI Verification Bundle    | `pnpm ci:verify`           | Aggregator-Skript (`scripts/ci-verify.mjs`) führt Type-, Test-, Coverage-, Policy- und Sanity-Gates aus                                |
| Governance & Policy Sweep | `pnpm policy:check`        | OPA, Guardrails, Kyverno sowie Sigillin-Reports (`out/policy/`)                                                                        |
| Observability Smoke       | `pnpm observability:check` | Prometheus `/api/v1/targets` und Grafana `/api/health` Checks (respektiert `PROMETHEUS_REQUIRE_ACTIVE` & `OBSERVABILITY_SKIP_GRAFANA`) |

---

## Mandala Climate Dashboard

- **Konfiguration:** `config/climate-dashboard.yaml`
- **Adapter (Stub→Live):** `src/adapters` (ERA5, OISST, EFFIS, Pegel, Biodiversität, Radar, SPEI)
- **Utilities:** `src/utils` (Resampling, Z-Scores, MRV/STAC)

- **Boundary (Getting Started):** `docs/boundary/GettingStarted.md`
- **Boundary Demo UI:** open `/demo/boundary` after `pnpm -F mandala-ui dev`

Die Adapter sind initial als Stubs verfügbar und werden schrittweise an echte Feeds gebunden.

---

## Cosmic-Web Demo (Sigillin × CREP)

**Was wird gezeigt?**

- Synthetic tracer dataset (`analysis/cosmic-web/`) visualisiert als animiertes Canvas im Fourier-Layer.
- Live CREP-Bewertung über das neue Workspace-Paket `@mandala/crep`.
- Sigillin & STAC-Artefakte bilden die Governance-/Daten-Story (`sigils/demos/cosmic-web.sigill.json`, `out/stac/cosmic-web/item.json`).

### Prereqs

Einmalig die gleiche Toolchain herstellen wie im Quickstart (Node ≥ 20, pnpm via Corepack, optionale Python-Adapter). Die folgenden Snippets spiegeln die offiziellen Setup-Skripte wider und sind plattformfreundlich formuliert.

#### Windows PowerShell (v5+)

> PowerShell 5 akzeptiert kein `&&`. Verwende neue Zeilen oder `;`.

```powershell
corepack enable; corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
$env:PANTHEON_DISABLE = '1'      # optional: Analytics ausschalten
```

#### macOS / Linux (bash/zsh)

```bash
corepack enable && corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
export PANTHEON_DISABLE=1       # optional
```

### Demo starten

```bash
pnpm demo:cosmic                # Daten, Sigillin, STAC-Item generieren & publizieren
# optional: separater Vite-Start, falls das Kombiscript keinen Port öffnet
pnpm -F mandala-ui dev -- --port 5173
```

Im Browser anschließend `http://localhost:5173/demo/cosmic-web` laden.

### Realtime-Telemetrie (optional)

```bash
pnpm nats:docker                # startet NATS/JetStream auf nats://localhost:4222
pnpm demo:cosmic:tick           # publiziert Live-Ticks
```

> Hinweis: Port **4222** ist der NATS-TCP-Port. Ein Browser-Request liefert erwartungsgemäß `-ERR 'Unknown Protocol Operation'`.

### Live-Events inspizieren

- Node-Subscriber: `pnpm sub:cosmic`
  - Variablen: `COSMIC_SUBJECT` (Standard: `demo.cosmic`), `NATS_URL` (Komma/Leerzeichen-separierte Liste) und optional `COSMIC_QUEUE` für Queue-Groups.
- NATS CLI (falls installiert): `nats sub "demo.cosmic" -s nats://localhost:4222`

Die UI nutzt dieselben Subjects; stimmen keine Events, vergleiche die Angaben in `scripts/realtime/cosmic-publisher.mjs`.

> 🎯 Tipp: Mit `pnpm test:unit:crep` lässt sich das Workspace-Paket `@mandala/crep` gezielt testen.

---

## Repository-Navigator

- **Onboarding:** `scripts/onboarding-ritual.md`
- **Handbuch (Kanon):** `Handbuch.md`
- **Dev Shortcuts (pnpm/npm/yarn):** `docs/DEV-SHORTCUTS.md`
- **Offline-Bundle:** `docs/offline/docker-compose.yml`
- **ToDo-System:** `advancedToDo.yaml` / `advancedToDo.json` (Sync: `node scripts/sync-todo-progress.js`)
- **Governance/Ethik:** `docs/governance/HI-Compact.md`, `docs/governance/policy-suite.md`, `AI_POLICY.md`, `agents.yaml`

---

## Development

**Workspaces:** `pnpm-workspace.yaml`

```jsonc
{
  "scripts": {
    "dev:ui": "pnpm -F mandala-ui dev",
    "build:ui": "pnpm -F mandala-ui build",
    "dev": "cross-env UI_DIST=http://localhost:5173 pnpm -F mandala-ui dev",
    "dev:services": "tsx scripts/dev-server.ts",
    "dev:stack": "node scripts/dev-services.mjs --mode=dev",
    "dev:ports:free": "pnpm dlx kill-port 3001 3002 3003 3004 4020 4021",
    "start:services": "pnpm -s build && NODE_ENV=production node scripts/dev-services.mjs --mode=prod",
  },
}
```

**Docker-Hygiene:** `.dockerignore` im Root:

```
node_modules
**/node_modules
.pnpm-store
dist
build
.git
*.log
```

---

## Architektur (Skizze)

- **Sigillin-Ebene** · Symbolische Interaktion, Rituale
- **CREP-Kernel** · Kohärenz/Resonanz/Emergenz/Poetik
- **Agenten** · Ingest, Analyse, Synthese, Governance
- **UIs/Dashboards** · Climate, Archive, Frequency
- **Pipelines** · Normalisierung → MRV/STAC → Exporte

Details im **Handbuch**.

---

## Governance & Ethik

Siehe `docs/governance/HI-Compact.md` und `AI_POLICY.md`. Transparenz über `advancedprogress.json`.

---

### Quick CI parity

Setze lokal die gleiche Umgebung, die auch im Workflow **CI Core / type-and-tests** aktiv ist:

```bash
export OFFLINE=1
export LOW_MEM=1
export VITE_LOW_MEM=on
export PYTHONPATH=src
```

**Core (CI Core / type-and-tests, required for every PR)**

```bash
pnpm lint
pnpm format:check
pnpm nats:doctor
pnpm test:ts:ci
pnpm test:jetstream
pnpm test:py
npx pyright
pnpm policy:check
```

> 🪟 `pnpm test:py` ruft jetzt `scripts/run-pytest.mjs` auf und hängt die Projekt-venv automatisch an den Pfad. Falls eine Shell den Wrapper blockiert, kannst du temporär `$env:Path = "$PWD\\.venv\\Scripts;$env:Path"` setzen oder `.\\.venv\\Scripts\\python.exe -m pytest -q` direkt ausführen.

**Extended (CI Extended, nightly or label `run-extended`)**

```bash
pnpm test:ts:extended
pnpm test:py:extended
CI=true pnpm adapter:build:oisst
CI=true pnpm adapter:build:era5
pnpm stac:validate
pnpm stac:validate:item out/example.item.json
pnpm prompts:coach --dry
pnpm test:unit:coverage       # Coverage-Report der Kernmodule
```

> 🪟 PowerShell: `$env:CI = "1"; pnpm adapter:build:oisst` und `$env:CI = "1"; pnpm adapter:build:era5` setzen das Environment
> ohne POSIX `CI=true`. Falls `scripts/run-dist.mjs` unter Windows einen `spawnSync pnpm.cmd EINVAL`-Fehler wirft, führe die
> TypeScript-Skripte direkt via `pnpm exec tsx <skript>` aus, z. B. `pnpm exec tsx scripts/validate-stac.ts out/example.item.json`
> oder `pnpm exec tsx scripts/prompt-coach.ts --dry`.

> ℹ️ `CI Experimental` läuft nur mit Label `run-experimental`. `ENABLE_EXPERIMENTAL_TESTS=1` schaltet zusätzliche, instabile Suites frei (z.B. `pnpm test:ts:experimental`).

### Sigillin (Inter-AI Bridges) & Validator

- Brücken-Dateien (je Provider):  
  `sigils/bridges/<provider>/<provider>-bridge.sigil.yaml|json` +  
  `docs/sigillin/bridges/<PROVIDER>_SIGILLIN.md`

- Lokal prüfen: `pnpm validate:sigillins`
  → validiert Struktur (JSON/YAML), **CREP/Trikāya/Nächste Schritte** und referenzierte Dateien (soft).
- Mandala-Erklärungen testen: `pnpm sigils:validate:mini -- --text "Zielbild …"`
  → prüft Antworten auf CREP-Vokabular, Trikāya-Verortung, nächste Handlung und Safety; `--input`/`--json` verfügbar.

- Korrekturen: `pnpm sigil:fix --dry-run` zeigt Vorschläge, `--auto` übernimmt fixbare Anpassungen.
  Leitfaden: `docs/sigillin/FIX_GUIDE.md`.

- CI: `.github/workflows/sigillin-validate.yml` prüft bei PR/Push.

### Dist-First Ausführung (`scripts/run-dist.mjs`)

- Produktionsskripte in `package.json` nutzen durchgängig `node scripts/run-dist.mjs <pfad-zur-ts-datei>`.
- Der Helper übersetzt TypeScript-Pfade deterministisch auf `dist/*.js`, stößt bei Bedarf automatisch `pnpm build` an und aktiviert `--enable-source-maps` für sauberes Debugging.
- Mit `UM_RUN_DIST_SKIP_BUILD=1` lässt sich der Auto-Build deaktivieren (z. B. in bereits gebauten CI-Läufen). Eigene Build-Kommandos können via `UM_RUN_DIST_BUILD_CMD="pnpm -r --filter my-app build"` hinterlegt werden.
- Direktaufruf möglich: `node scripts/run-dist.mjs services/ghost-shell/server.ts --flag`. Vorher `pnpm build`, wenn das Artefakt noch nicht existiert.

---

## Contributing

Kleine, thematische PRs (docs, adapters, agents). Vor Merge: `pnpm build:ui` + `pnpm dev` (Smoke: `/` → 200), Lint/Tests.

---

## Lizenz

MIT. Datenquellen: jeweilige Nutzungsbedingungen beachten.

## Repo-Kartografie & Flüsse

- **RepoMap**: `docs/maps/RepoMap.yaml` → `pnpm maps:build` erzeugt JSON
- **ProgramFlow**: `docs/maps/ProgramFlow.yaml` → Mermaid SVG unter `docs/diagrams/`
- **Pre-Rituale**: `docs/rituals/pre-rituale.md`

## Fraktal Diary Relocation

- Die Fraktal‑Dokumente liegen künftig unter `docs/fraktal/diary` (Codexfeedback unter `docs/fraktal/codexfeedback`).
- Übersicht: siehe `docs/fraktal/index.md`.
- Beim Umzug erzeugt `pnpm meta:fraktal:organize` automatisch Redirect‑Stubs an den alten Pfaden, damit bestehende Links nicht ins Leere laufen.

## 🚀 Quick Start (All-in-One, Port-Aware)

**Prereqs**

- Node 20.18.x, pnpm ≥ 10
- Ollama running locally with models:
  - `qwen2.5:7b` (chat)
  - `nomic-embed-text` (embeddings)

**One-time model pulls**

```bash
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

**Start everything**

```bash
# macOS/Linux
PORT_OFFSET=0 pnpm dev:all

# Windows PowerShell
$env:PORT_OFFSET="0"; pnpm dev:all
```

The launcher will:

- ensure a local **OPA** binary is available,
- set safe local defaults (Ollama, Verify-Gate, Boundary, RAG),
- free common dev ports (respecting `PORT_OFFSET`),
- start **dev stack** (boundary, health, RAG, flags, experiments, API, realtime),
- start **ethics API**, **verify-gate**, and **UI**.

**Default ports (base + offset)**

- Health: `3999 + PORT_OFFSET`
- API: `4000 + PORT_OFFSET`
- Boundary: `4010 + PORT_OFFSET`
- Realtime: `4020 + PORT_OFFSET`
- RAG/Experiments/Flags: `3003/3002/3004 + PORT_OFFSET`
- UI: Vite chooses `5173..5175` automatically

**Local LLM wiring (Ollama)**

```
AI_PROVIDER=openai
AI_BASE_URL=http://127.0.0.1:11434/v1
OPENAI_API_KEY=ollama
OPENAI_MODEL=qwen2.5:7b
OPENAI_EMBEDDING_MODEL=nomic-embed-text
EMBEDDINGS_BASE_URL=http://127.0.0.1:11434/v1
```

> Tip: Create `.env.dev.local` with your overrides. The launcher merges env and forwards to children.

**Sanity checks**

```bash
curl -s http://127.0.0.1:3999/health | jq .
# UI: http://localhost:5173  (or 5174/5175)
# Chat via gate guarded: POST http://127.0.0.1:4000/api/ai/chat
```

**OPA policy workflow**

```bash
# Build + sign + verify bundle
pnpm opa:bundle && pnpm opa:sign && pnpm opa:verify

# Format + lint + test
pnpm opa:fmt && pnpm opa:lint && pnpm opa:test -- --timeout 5s

# Coverage gate (fail <85%)
OPA_COVERAGE_MIN=0.85 pnpm opa:cover
```

### OPA Coverage Gate

```bash
# Pretty tests (human)
pnpm opa:test

# Coverage (JSON → gate; fails below 85%)
pnpm opa:cover
# or write to file then check
pnpm opa:cover:file
```

Outputs:

```
OPA coverage: 87.50% (70/80)  threshold: 85.00%
  - apps/ethics-api/opa/policy.rego: 81.82% (18/22)  not-covered=4
```
