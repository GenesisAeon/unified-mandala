[![PyPI](https://img.shields.io/pypi/v/unified-mandala)](https://pypi.org/project/unified-mandala/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19219948.svg)](https://doi.org/10.5281/zenodo.19219948)
[![Tests](https://github.com/GenesisAeon/unified-mandala/actions/workflows/python-ci.yml/badge.svg)](https://github.com/GenesisAeon/unified-mandala/actions/workflows/python-ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/GenesisAeon/unified-mandala)

# unified-mandala v0.3.2

**Holistic Mandala Orchestrator Framework** with complete Phase-3 thermodynamic, planetary, and QFT integration.
**DOI**: [10.5281/zenodo.19219948](https://doi.org/10.5281/zenodo.19219948)

> v0.3.2 — _Reactivation Patch: NukleonScanner v2.1.0 + GreekMath v2.1.0 + FieldTheory v2.0.0_

MandalaOrchestrator + CREP-Evaluator + SigillinBridge (19-adapter ring) + PolicyGate + EntropyGovernor +
AdapterRegistry + **Thermodynamics** (Landauer · Hatano-Sasa · Esposito-Van den Broeck) +
**Planetary Coupling** (IEA→CO₂→Albedo→Ice) + **MetaQuest-Sigillins** (AI-to-AI) +
**Collapse Detector** (SDE · Tainter · Prigogine · φ=0.618).

---

## What's New in v0.3.2

| Feature               | Module                                         | Description                                                                              |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| NukleonScanner v2.1.0 | `integrations.adapters.nukleonscanner_adapter` | Two-loop QCD αs(Q) + string-tension confinement φ_string                                 |
| GreekMath v2.1.0      | `integrations.adapters.greekmath_adapter`      | Logarithmic (golden-angle) spiral + Fibonacci ratio resonance                            |
| FieldTheory v2.0.0    | `integrations.adapters.fieldtheory`            | Klein-Gordon scalar field, dispersion ω²=k²+m², Euclidean propagator, Lagrangian density |
| CLI: `nukleon`        | `cli.rituals`                                  | `unified-mandala nukleon --entropy 0.618 --phases 7`                                     |
| CLI: `greekmath`      | `cli.rituals`                                  | `unified-mandala greekmath --entropy 0.618 --phases 7`                                   |
| CLI: `fieldtheory`    | `cli.rituals`                                  | `unified-mandala fieldtheory --entropy 0.618 --phases 7`                                 |
| +45 new tests         | `tests/python/unit/integrations/`              | Unit + contract tests for all three adapters                                             |

---

## What's New in v0.3.1

| Feature                       | Module                  | Description                                                      |
| ----------------------------- | ----------------------- | ---------------------------------------------------------------- |
| Tension metric                | `collapse_detector`     | `Tension(t) = Γ_Klima · Q_KI(t) / (V_Eis(t) + ε)`                |
| Albedo-loss metric            | `collapse_detector`     | `albedo_loss = albedo_factor / (V + ε)`                          |
| Regenerative SDE mode         | `collapse_detector`     | 87.2× neuromorphic noise damping (`--regenerative`)              |
| `albedo_loss_metric`          | `planetary.coupling`    | Per-module albedo-loss function                                  |
| Regenerative η-offset         | `planetary.coupling`    | `ΔF_regen = η · Q_waste / 87.2` waste-heat recycling             |
| Neuromorphic counterquestions | `sigillins.metaquest`   | New SYNTHESIS-tier questions (neuromorphic + Landauer scenarios) |
| `--regenerative` CLI flag     | `collapse`, `metaquest` | Activates regenerative countermeasure mode in both commands      |

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

## Python Quick Start (v0.3.2)

```bash
pip install unified-mandala==0.3.2
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

# Collapse detection (standard)
det = CollapseDetector()
traj = det.simulate(x0=0.4)
print(f"Collapsed: {traj.collapsed} | Risk: {det.collapse_risk(traj):.3f}")

# Phase-3: Tension metric + albedo loss
from unified_mandala.collapse_detector import compute_tension_metric, albedo_loss
tension = compute_tension_metric(gamma_klima=3.5, q_ki=8.0, v_ice=5000.0)
a_loss = albedo_loss(albedo_factor=0.74, v_ice=5000.0)
print(f"Tension(t) = {tension:.4f}  |  albedo_loss = {a_loss:.6e}")

# Regenerative collapse mode (87.2× neuromorphic noise damping)
from unified_mandala.collapse_detector import CollapseDetector, CollapseDetectorConfig
det_regen = CollapseDetector(CollapseDetectorConfig(regenerative=True))
traj_regen = det_regen.simulate(x0=0.4)
print(f"Regenerative: risk = {det_regen.collapse_risk(traj_regen):.3f}")
```

## CLI Commands (v0.3.2)

```bash
# Standard mandala cycle
unified-mandala cycle --entropy 0.618 --phases 7 --simulate

# Thermodynamic evaluation (Landauer + Esposito-Tainter)
unified-mandala thermodynamics --entropy 0.618 --temperature 300

# Collapse detection (SDE + Tainter/Prigogine)
unified-mandala collapse --entropy 0.72 --crep 0.6 --lambda 3.0 --runs 10

# Collapse detection — regenerative mode (87.2× neuromorphic noise damping)
unified-mandala collapse --entropy 0.72 --crep 0.6 --regenerative

# MetaQuest counterquestions (4-tier epistemic protocol)
unified-mandala metaquest --crep 0.85 --entropy 0.15 --n 5

# MetaQuest — regenerative scenarios (neuromorphic + Landauer countermeasures)
unified-mandala metaquest --crep 0.85 --entropy 0.15 --n 5 --regenerative

# Planetary coupling chain (IEA→CO₂→Albedo→Ice)
unified-mandala planetary --energy 620.0 --baseline-co2 421.0

# NukleonScanner — QCD αs + QGP proximity + string tension (v2.1.0)
unified-mandala nukleon --entropy 0.618 --phases 7

# GreekMath — Pythagorean + golden section + spirals + Fibonacci (v2.1.0)
unified-mandala greekmath --entropy 0.618 --phases 7

# FieldTheory — Klein-Gordon scalar field + propagator + dispersion (v2.0.0)
unified-mandala fieldtheory --entropy 0.618 --phases 7
```

---

---

[![CI Core](https://github.com/ChefDevAI/unified-mandala/actions/workflows/ci.core.yml/badge.svg)](../../actions/workflows/ci.core.yml)
[![Nightly](https://github.com/ChefDevAI/unified-mandala/actions/workflows/ci.nightly.yml/badge.svg)](../../actions/workflows/ci.nightly.yml)
[![OPA Coverage Gate](https://img.shields.io/badge/opa--coverage-gate-%E2%9C%93-brightgreen)](./docs/runbooks/command-catalog.md#opa)
[![Verify-Gate Network Safety](https://img.shields.io/badge/grafana-verify--gate--network--safety-1f6feb)](#dashboards)
[![Ethics Mini](https://img.shields.io/badge/grafana-ethics--mini-1f6feb)](#dashboards)
[![OPA Coverage](https://img.shields.io/badge/grafana-opa--coverage-1f6feb)](#dashboards)

> “An operating system that breathes — a mandala that thinks.”

UnifiedMandala is a holistic, modular framework for symbolic AI, CREP, and conscious, public-good-oriented systems. It combines **CREP logic** (Coherence, Resonance, Emergence, Poetics), **Sigillin** (poetic-symbolic interaction), and **agents** into an ethically grounded platform.

---

## TL;DR – 5-Minute Quick Start

```bash
# 0) Optional: guided setup (installs toolchain & hooks)
./scripts/setup-dev-env.sh                 # Linux/macOS
pwsh -NoProfile -File ./scripts/setup-dev-env.ps1  # Windows (PowerShell 7+)
# fallback: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-dev-env.ps1

# 1) Toolchain (Node >= 20, pnpm 10.17.0)
node -v
corepack enable
corepack prepare pnpm@10.17.0 --activate

# 2) Dependencies (dist-first build pipeline)
pnpm install --frozen-lockfile
pnpm build

# 2.1) Environment
cp .env.example .env # set CDS_API_KEY

# 3) UI (Dev, with HMR, Port 5173)
pnpm dev:ui
# -> http://localhost:5173

# 4) Optional parallel: Backend/Dev-Server serves UI (Port 3000)
pnpm start:light             # static assets (after pnpm build:ui)
pnpm dev                     # Node server with built assets
# -> http://localhost:3000  (serves the built UI)

# 5) Offline bundle (Docker)
docker compose -f docs/offline/docker-compose.yml build
docker compose -f docs/offline/docker-compose.yml up
# -> UI usually at http://localhost:5173

# 6) Observability profile (Prometheus/Grafana, optional)
docker compose --profile monitoring up
# -> Prometheus http://localhost:9090, Grafana http://localhost:3300 (admin/admin)
```

> 🔐 Governance gates overview: Read the [Mandala Governance Primer](docs/governance/primer.md) for signature, coverage, and verify-gate rules. The concrete commands are in the [Command Catalog](docs/runbooks/command-catalog.md#opa).

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

### Health Aggregator (local)

- Start: `pnpm dev:health`
- Check: `http://localhost:3999/health` (or shifted with `PORT_OFFSET`)

Example with port offset 100: `PORT_OFFSET=100 pnpm dev:health` -> Health at `http://localhost:4099/health`.

### Real User Monitoring (RUM)

- Enable (Vite UI): `VITE_ENABLE_RUM=on pnpm dev:ui`
- Optional collector: `VITE_OTEL_COLLECTOR_URL=http://localhost:4318/v1/traces`
- Privacy: RUM is disabled by default. Follow internal policies and only enable with informed consent.

### RUM Traces (Grafana)

- Import dashboard: `grafana/dashboards/rum-traces.json`
- Explore query (Tempo · TraceQL):

```
service.name = "mandala-ui" and span.name = "ui.metrics.test"
```

- Send demo span in playground: Proxy Metrics → Trace test (RUM must be active).

> **Notes:**
> • "Cannot GET /" on :3000 means: backend is not serving the HMR UI. Either use **Vite-Dev** (`pnpm dev:ui`) or **build statically** (`pnpm build:ui && pnpm dev`).
> • For observability with Prometheus/Grafana, start the `monitoring` compose profile (see `observability/README.md`) and verify with `pnpm observability:check` for Prometheus (`/api/v1/targets`) and Grafana (`/api/health`, host port 3300).
> • Windows: Enable long paths; `.dockerignore` in the repo root prevents huge build contexts.
> • `corepack enable` requires administrator rights. When working without admin rights, `scripts/setup-dev-env.ps1` automatically runs user-level activation via `corepack prepare pnpm@10.17.0 --activate` and skips the persistent enable.
> • `pnpm start:all` requires a running JetStream-capable `nats-server`. Use `pnpm nats:docker` for a preconfigured Docker container (`nats:latest -js`) or install locally via `winget install --id Synadia.NATS-Server -e` and start it with the `-js` option.
> • Existing `nats` Docker containers can be checked with `docker ps -a --filter name=^/nats$ --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"` and reactivated with `docker start nats` if needed; `scripts/setup-dev-env.ps1` reports running containers as satisfied and hints at these commands for `Exited` status (Windows port check: `Test-NetConnection 127.0.0.1 -Port 4222`).
> • `pnpm dev:stack` checks ports automatically and attempts to free occupied default ports via `pnpm dlx kill-port`. Manual cleanup available via `pnpm dev:ports:free` or `pnpm dlx kill-port <port>`; auto-cleanup can be disabled with `UM_DEV_SERVICES_AUTOFREE_PORTS=0`.
> • JetStream operation & self-check: `docs/runbooks/nats-jetstream.md` and `docs/runbooks/MaxBundle.md` bundle setup, Docker profiles, and `pnpm nats:doctor`/`pnpm test:jetstream` troubleshooting.
> • `pnpm nats:doctor` provides direct hints on errors (e.g. JetStream not activated, timeout/firewall, missing permissions) and uses `$JS.API.INFO` as fallback.

### Windows Dev-Shortcuts

See quick reference at `docs/DEV-SHORTCUTS.md` for PowerShell helpers (set secrets, start dev stack/health, smoke checks):

```powershell
. ./scripts/dev-helper.ps1
Set-UMSecrets -ApiKey '<KEY>'
Start-UM; Start-UMHealth
Smoke-AI -Message 'Hello Aeon!'
```

## Quickstart (Windows · PowerShell)

```powershell
corepack prepare pnpm@10.17.0 --activate
pnpm install --frozen-lockfile

# Start JetStream container
docker rm -f nats 2>$null
docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js
pnpm nats:doctor

# UI Dev-Server (Terminal A)
pnpm -F mandala-ui dev -- --port 5173

# Dev-Stack (Terminal B)
$env:NATS_URL = "nats://127.0.0.1:4222"
pnpm dev:stack

# UI smoke against running instance (Vite auto-port via env)
$env:UI_DEV_URL = "http://localhost:5173"
pnpm smoke:ui
```

> If Vite switches to a free port (e.g. 5174), set `UI_DEV_URL` accordingly (`http://localhost:5174`).
> The dev stack clears ports automatically by default (kill-port). If processes are stubborn, use `pnpm dlx kill-port 3001 3002 3003 3004 4020 4021` manually or `setx UM_DEV_SERVICES_AUTOFREE_PORTS 0` to disable auto-cleanup.
> 🪩 **PowerShell tip:** Display files via `Get-Content` or `type` (`cat` is an alias but without pipe behavior); set environment variables before the command with `$env:NAME = 'value'` — inline syntax `NAME=value pnpm …` does not work in PowerShell.

### Windows: Additional Tools & Tests

> Common pitfalls on Windows can be avoided with a few targeted commands.

| Purpose                         | Command                                                      | Note                                                                                                      |
| ------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Run pytest via project venv     | `.\.venv\Scripts\python.exe -m pytest -q`                    | Guaranteed to use the repository-provisioned environment; works even when `pytest` is not in `%PATH%`.    |
| Alternative pytest launcher     | `.\.venv\Scripts\pytest.exe -q`                              | Direct call to the `pytest` CLI if PowerShell blocks module execution.                                    |
| Headless Chrome for Mermaid CLI | `pnpm exec puppeteer browsers install chrome-headless-shell` | Installs the Chrome binary expected by `@mermaid-js/mermaid-cli` locally in the pnpm store.               |
| Prepare Cypress binary          | `pnpm exec cypress install`                                  | Downloads the pinned Cypress version (14.5.1) and ensures `pnpm cy:run` starts without version conflicts. |

## Build, Test & Policy Bundles

Use the bundled pnpm commands to replicate the CI/governance gates described in DevTalk74 locally:

| Purpose                   | Command                    | Included Checks                                                                                                                     |
| ------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Pre-Commit Heavy Gate     | `pnpm check:precommit`     | lint-staged, TypeScript linting, Vitest unit tests, schema/maps/repomap validation, repo sanity, policy suite                       |
| Pre-Push Heavy Gate       | `pnpm check:prepush`       | Vitest coverage run plus policy suite                                                                                               |
| CI Core Parity            | `pnpm check:ci`            | Typecheck, Vitest unit tests, schema/maps/repomap validation, repo sanity, policy suite                                             |
| CI Verification Bundle    | `pnpm ci:verify`           | Aggregator script (`scripts/ci-verify.mjs`) runs type, test, coverage, policy, and sanity gates                                     |
| Governance & Policy Sweep | `pnpm policy:check`        | OPA, guardrails, Kyverno, and sigillin reports (`out/policy/`)                                                                      |
| Observability Smoke       | `pnpm observability:check` | Prometheus `/api/v1/targets` and Grafana `/api/health` checks (respects `PROMETHEUS_REQUIRE_ACTIVE` & `OBSERVABILITY_SKIP_GRAFANA`) |

---

## Mandala Climate Dashboard

- **Configuration:** `config/climate-dashboard.yaml`
- **Adapters (Stub→Live):** `src/adapters` (ERA5, OISST, EFFIS, Gauge, Biodiversity, Radar, SPEI)
- **Utilities:** `src/utils` (resampling, Z-scores, MRV/STAC)

- **Boundary (Getting Started):** `docs/boundary/GettingStarted.md`
- **Boundary Demo UI:** open `/demo/boundary` after `pnpm -F mandala-ui dev`

Adapters are initially available as stubs and will be progressively connected to live data feeds.

---

## Cosmic-Web Demo (Sigillin × CREP)

**What is demonstrated?**

- Synthetic tracer dataset (`analysis/cosmic-web/`) visualized as an animated canvas in the Fourier layer.
- Live CREP evaluation via the new workspace package `@mandala/crep`.
- Sigillin & STAC artifacts form the governance/data story (`sigils/demos/cosmic-web.sigill.json`, `out/stac/cosmic-web/item.json`).

### Prereqs

Set up the same toolchain as in the Quick Start once (Node ≥ 20, pnpm via Corepack, optional Python adapters). The following snippets mirror the official setup scripts and are formulated to be platform-friendly.

#### Windows PowerShell (v5+)

> PowerShell 5 does not accept `&&`. Use new lines or `;`.

```powershell
corepack enable; corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
$env:PANTHEON_DISABLE = '1'      # optional: disable analytics
```

#### macOS / Linux (bash/zsh)

```bash
corepack enable && corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
export PANTHEON_DISABLE=1       # optional
```

### Start the Demo

```bash
pnpm demo:cosmic                # generate & publish data, sigillin, STAC item
# optional: separate Vite start if the combined script does not open a port
pnpm -F mandala-ui dev -- --port 5173
```

Then open `http://localhost:5173/demo/cosmic-web` in your browser.

### Realtime Telemetry (optional)

```bash
pnpm nats:docker                # starts NATS/JetStream at nats://localhost:4222
pnpm demo:cosmic:tick           # publishes live ticks
```

> Note: Port **4222** is the NATS TCP port. A browser request will expectedly return `-ERR 'Unknown Protocol Operation'`.

### Inspect Live Events

- Node subscriber: `pnpm sub:cosmic`
  - Variables: `COSMIC_SUBJECT` (default: `demo.cosmic`), `NATS_URL` (comma/space-separated list) and optionally `COSMIC_QUEUE` for queue groups.
- NATS CLI (if installed): `nats sub "demo.cosmic" -s nats://localhost:4222`

The UI uses the same subjects; if no events arrive, compare the settings in `scripts/realtime/cosmic-publisher.mjs`.

> 🎯 Tip: Use `pnpm test:unit:crep` to run targeted tests for the `@mandala/crep` workspace package.

---

## Repository Navigator

- **Onboarding:** `scripts/onboarding-ritual.md`
- **Handbook (Canon):** `Handbuch.md`
- **Dev Shortcuts (pnpm/npm/yarn):** `docs/DEV-SHORTCUTS.md`
- **Offline Bundle:** `docs/offline/docker-compose.yml`
- **Todo System:** `advancedToDo.yaml` / `advancedToDo.json` (sync: `node scripts/sync-todo-progress.js`)
- **Governance/Ethics:** `docs/governance/HI-Compact.md`, `docs/governance/policy-suite.md`, `AI_POLICY.md`, `agents.yaml`

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

**Docker hygiene:** `.dockerignore` in root:

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

## Architecture (Outline)

- **Sigillin layer** · Symbolic interaction, rituals
- **CREP kernel** · Coherence/Resonance/Emergence/Poetics
- **Agents** · Ingest, analysis, synthesis, governance
- **UIs/Dashboards** · Climate, archive, frequency
- **Pipelines** · Normalization → MRV/STAC → exports

Details in the **Handbook**.

---

## Governance & Ethics

See `docs/governance/HI-Compact.md` and `AI_POLICY.md`. Transparency via `advancedprogress.json`.

---

### Quick CI parity

Set the same environment locally as in the **CI Core / type-and-tests** workflow:

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

> 🪩 `pnpm test:py` now calls `scripts/run-pytest.mjs` and automatically appends the project venv to the path. If a shell blocks the wrapper, temporarily set `$env:Path = "$PWD\\.venv\\Scripts;$env:Path"` or run `.\\.venv\\Scripts\\python.exe -m pytest -q` directly.

**Extended (CI Extended, nightly or label `run-extended`)**

```bash
pnpm test:ts:extended
pnpm test:py:extended
CI=true pnpm adapter:build:oisst
CI=true pnpm adapter:build:era5
pnpm stac:validate
pnpm stac:validate:item out/example.item.json
pnpm prompts:coach --dry
pnpm test:unit:coverage       # coverage report for core modules
```

> 🪩 PowerShell: `$env:CI = "1"; pnpm adapter:build:oisst` and `$env:CI = "1"; pnpm adapter:build:era5` set the environment
> without POSIX `CI=true`. If `scripts/run-dist.mjs` throws a `spawnSync pnpm.cmd EINVAL` error on Windows, run the
> TypeScript scripts directly via `pnpm exec tsx <script>`, e.g. `pnpm exec tsx scripts/validate-stac.ts out/example.item.json`
> or `pnpm exec tsx scripts/prompt-coach.ts --dry`.

> ℹ️ `CI Experimental` only runs with label `run-experimental`. `ENABLE_EXPERIMENTAL_TESTS=1` enables additional, unstable suites (e.g. `pnpm test:ts:experimental`).

### Sigillin (Inter-AI Bridges) & Validator

- Bridge files (per provider):  
  `sigils/bridges/<provider>/<provider>-bridge.sigil.yaml|json` +  
  `docs/sigillin/bridges/<PROVIDER>_SIGILLIN.md`

- Validate locally: `pnpm validate:sigillins`
  → validates structure (JSON/YAML), **CREP/Trikāya/next steps**, and referenced files (soft).
- Test mandala explanations: `pnpm sigils:validate:mini -- --text "target vision …"`
  → checks responses for CREP vocabulary, Trikāya positioning, next action, and safety; `--input`/`--json` available.

- Corrections: `pnpm sigil:fix --dry-run` shows suggestions, `--auto` applies fixable adjustments.
  Guide: `docs/sigillin/FIX_GUIDE.md`.

- CI: `.github/workflows/sigillin-validate.yml` validates on PR/push.

### Dist-First Execution (`scripts/run-dist.mjs`)

- Production scripts in `package.json` consistently use `node scripts/run-dist.mjs <path-to-ts-file>`.
- The helper deterministically translates TypeScript paths to `dist/*.js`, automatically triggers `pnpm build` if needed, and enables `--enable-source-maps` for clean debugging.
- Set `UM_RUN_DIST_SKIP_BUILD=1` to disable auto-build (e.g. in already-built CI runs). Custom build commands can be set via `UM_RUN_DIST_BUILD_CMD="pnpm -r --filter my-app build"`.
- Direct invocation: `node scripts/run-dist.mjs services/ghost-shell/server.ts --flag`. Run `pnpm build` first if the artifact does not yet exist.

---

## Contributing

Small, focused PRs (docs, adapters, agents). Before merge: `pnpm build:ui` + `pnpm dev` (smoke: `/` → 200), lint/tests.

---

## License

MIT. Data sources: respect their respective terms of use.

## Repo Cartography & Flows

- **RepoMap**: `docs/maps/RepoMap.yaml` → `pnpm maps:build` generates JSON
- **ProgramFlow**: `docs/maps/ProgramFlow.yaml` → Mermaid SVG in `docs/diagrams/`
- **Pre-Rituals**: `docs/rituals/pre-rituale.md`

## Fractal Diary Relocation

- Fractal documents now live under `docs/fraktal/diary` (codex feedback under `docs/fraktal/codexfeedback`).
- Overview: see `docs/fraktal/index.md`.
- During migration, `pnpm meta:fraktal:organize` automatically creates redirect stubs at the old paths so existing links remain valid.

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
