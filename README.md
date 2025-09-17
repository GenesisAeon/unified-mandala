# UnifiedMandala

> „Ein Betriebssystem, das atmet – ein Mandala, das denkt.“

UnifiedMandala ist ein holistisches, modulares Framework für symbolische KI, CREP und bewusste, gemeinwohlorientierte Systeme. Es verbindet **CREP-Logik** (Coherence, Resonance, Emergence, Poetics), **Sigillin** (poetisch-symbolische Interaktion) und **Agenten** zu einer ethisch getragenen Plattform.

---

## TL;DR – 5-Minuten-Quickstart

```bash
# 0) Optional: geführtes Setup (installiert Toolchain & Hooks)
./scripts/setup-dev-env.sh

# 1) Toolchain (Node >= 20, pnpm 10.16.1)
node -v
corepack enable
corepack prepare pnpm@10.16.1 --activate

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
# -> Prometheus http://localhost:9090, Grafana http://localhost:3000 (admin/admin)
```

> **Hinweise:**  
> • „Cannot GET /“ auf :3000 bedeutet: Backend servt keine HMR-UI. Entweder **Vite-Dev** (`pnpm dev:ui`) nutzen oder **statisch bauen** (`pnpm build:ui && pnpm dev`).
> • Für Observability mit Prometheus/Grafana das Compose-Profil `monitoring` starten (siehe `observability/README.md`).
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
- **Governance/Ethik:** `docs/governance/HI-Compact.md`, `docs/governance/policy-suite.md`, `AI_POLICY.md`, `agents.yaml`

---

## Development

**Workspaces:** `pnpm-workspace.yaml`

```jsonc
{
  "scripts": {
    "dev:ui": "pnpm -F mandala-ui dev",
    "build:ui": "pnpm -F mandala-ui build",
    "dev": "cross-env UI_DIST=apps/ui/dist tsx scripts/dev-server.ts",
    "dev:services": "node scripts/dev-services.mjs --mode=dev",
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
pnpm test:ts:ci
pnpm test:py
npx pyright
pnpm policy:check
```

**Extended (CI Extended, nightly or label `run-extended`)**

```bash
pnpm test:ts:extended
pnpm test:py:extended
CI=true pnpm adapter:build:oisst
CI=true pnpm adapter:build:era5
pnpm stac:validate
pnpm stac:validate:item out/example.item.json
pnpm prompts:coach --dry
pnpm test:unit                # Coverage-Report der Kernmodule
```

> ℹ️ `CI Experimental` läuft nur mit Label `run-experimental`. `ENABLE_EXPERIMENTAL_TESTS=1` schaltet zusätzliche, instabile Suites frei (z.B. `pnpm test:ts:experimental`).

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
