# UnifiedMandala

> „Ein Betriebssystem, das atmet – ein Mandala, das denkt.“

UnifiedMandala ist ein holistisches, modulares Framework für symbolische KI, CREP und bewusste, gemeinwohlorientierte Systeme. Es verbindet **CREP-Logik** (Coherence, Resonance, Emergence, Poetics), **Sigillin** (poetisch-symbolische Interaktion) und **Agenten** zu einer ethisch getragenen Plattform.

---

## TL;DR – 5-Minuten-Quickstart

```bash
# 1) Toolchain
node -v
corepack enable
corepack prepare pnpm@8.15.6 --activate

# 2) Dependencies
pnpm install

# 2.1) Environment
cp .env.example .env # set CDS_API_KEY

# 3) UI (Dev, mit HMR, Port 5173)
pnpm dev:ui
# -> http://localhost:5173

# 4) Optional parallel: Backend/Dev-Server liefert UI (Port 3000)
pnpm build:ui
pnpm dev
# -> http://localhost:3000  (liefert die gebaute UI aus)

# 5) Offline-Bundle (Docker)
docker compose -f docs/offline/docker-compose.yml build
docker compose -f docs/offline/docker-compose.yml up
# -> UI i. d. R. auf http://localhost:5173
```

> **Hinweise:**  
> • „Cannot GET /“ auf :3000 bedeutet: Backend servt keine HMR-UI. Entweder **Vite-Dev** (`pnpm dev:ui`) nutzen oder **statisch bauen** (`pnpm build:ui && pnpm dev`).  
> • Windows: Lange Pfade aktivieren; `.dockerignore` im Repo-Root verhindert riesige Build-Kontexte.

---

## Mandala Climate Dashboard

 - **Konfiguration:** `config/climate-dashboard.yaml`
- **Adapter (Stub→Live):** `src/adapters` (ERA5, OISST, EFFIS, Pegel, Biodiversität, Radar, SPEI)  
- **Utilities:** `src/utils` (Resampling, Z-Scores, MRV/STAC)

Die Adapter sind initial als Stubs verfügbar und werden schrittweise an echte Feeds gebunden.

---

## Repository-Navigator

- **Onboarding:** `scripts/onboarding-ritual.md`  
- **Handbuch (Kanon):** `Handbuch.md`  
- **Offline-Bundle:** `docs/offline/docker-compose.yml`  
- **ToDo-System:** `advancedToDo.yaml` / `advancedToDo.json` (Sync: `node scripts/sync-todo-progress.js`)  
- **Governance/Ethik:** `docs/governance/HI-Compact.md`, `AI_POLICY.md`, `agents.yaml`

---

## Development

**Workspaces:** `pnpm-workspace.yaml`

```jsonc
{
  "scripts": {
    "dev:ui": "pnpm -F mandala-ui dev",
    "build:ui": "pnpm -F mandala-ui build",
    "dev": "cross-env NODE_ENV=development ts-node scripts/dev-server.ts",
    "dev:all": "pnpm -r --parallel dev"
  }
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

**Core · CI Core / type-and-tests (Pflicht bei jedem PR)**  
Setze lokal `OFFLINE=1` und `LOW_MEM=1`, damit derselbe Testfilter wie in GitHub Actions greift.

```bash
pnpm lint
OFFLINE=1 pnpm test:ts:ci
OFFLINE=1 pnpm test:py
npx pyright
```

**Extended · CI Extended (Nightly + Label `run-extended`)**

```bash
pnpm test:ts:extended
pnpm test:py:extended
PYTHONPATH=src pnpm adapter:build:oisst
PYTHONPATH=src pnpm adapter:build:era5
pnpm stac:validate
```

**Experimental · CI Experimental (Label `run-experimental`)**

```bash
pnpm test:ts:experimental
pnpm test:py:all
pnpm agents:dry-run --verbose
pnpm guardrails:validate
```

> Vitest-Suiten werden über `ENABLE_EXTENDED_TESTS` / `ENABLE_EXPERIMENTAL_TESTS` gesteuert; die pnpm-Skripte setzen die Flags automatisch. Legacy-Workflows (`fraktal21-ci`, `ci-fraktal22`, `fraktal-ci`, `agents`, `agents_ci`, `build-maps`) sind archiviert (`*.yml.disabled`). Aktiv bleiben `ci.core.yml`, `ci.extended.yml`, `ci.experimental.yml`, Policy/Governance Checks sowie ein nicht blockierender `zipmem-ci`.

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

