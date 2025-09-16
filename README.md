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

# 4) Aggregierte Services (DEV)
pnpm dev:services
# -> Startet rag-api, flags-api, experiments-api, share-api und realtime-hub (tsx-Fallback)

# 5) Optional: Backend-Server liefert gebaute UI (Port 3000)
pnpm build:ui
pnpm dev
# -> http://localhost:3000  (liefert die gebaute UI aus)

# 6) Dist-Build & Production-Smoke
pnpm build:dist
pnpm start:services  # nutzt vorcompilierte JS-Dateien

# 7) Offline-Bundle (Docker)
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
    "dev": "cross-env UI_DIST=apps/ui/dist tsx scripts/dev-server.ts",
    "dev:services": "tsx scripts/dev-services.ts",
    "start:services": "node dist/scripts/dev-services.js --dist",
  },
}
```

**Linting & Formatting:**

- Pre-commit Hook (`.husky/pre-commit`) ruft `pnpm lint:staged` auf und prüft die geänderten Dateien mit ESLint + Prettier.
- Manuell: `pnpm lint` (Typecheck + ESLint), `pnpm format:check` (dry-run), `pnpm format` (schreibt).

**Service-Orchestrator:**

- `pnpm dev:services` startet alle Kernservices via `tsx` und nutzt Dist-Builds, sobald sie vorhanden sind.
- `pnpm start:services` lädt den Orchestrator aus `dist/` und versucht Dist-Entrypoints zu verwenden – fehlen Artefakte, erscheint ein Fallback-Hinweis und `tsx` übernimmt temporär.
- `MANDALA_SERVICES_DIST=1 pnpm dev:services` erzwingt die Dist-Variante für CI-Smokes.

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

## Operations & Monitoring

- **Prometheus Endpoint:** `services/ghost-shell/server.ts` liefert `/metrics` über `packages/core/middleware/metrics.ts` und nutzt den zentralen Registry-Singleton (`src/metrics/singleton.ts`).
- **Scrape-Konfiguration:** siehe `observability/prometheus.yml` (Target z. B. `http://localhost:4020/metrics`).
- **Dashboards:** `observability/grafana` enthält Panels für Request-Latenzen & Live-Verbindungen.

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
pnpm exec node tools/schema-validate.mjs
pnpm exec node tools/governance-check.mjs
```

> ℹ️ `CI Experimental` läuft nur mit Label `run-experimental`. `ENABLE_EXPERIMENTAL_TESTS=1` schaltet zusätzliche, instabile Suites frei (z.B. `pnpm test:ts:experimental`).

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
