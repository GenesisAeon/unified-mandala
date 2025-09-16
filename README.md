# UnifiedMandala

> „Ein Betriebssystem, das atmet – ein Mandala, das denkt.“

UnifiedMandala ist ein holistisches, modulares Framework für symbolische KI, CREP und bewusste, gemeinwohlorientierte Systeme. Es verbindet **CREP-Logik** (Coherence, Resonance, Emergence, Poetics), **Sigillin** (poetisch-symbolische Interaktion) und **Agenten** zu einer ethisch getragenen Plattform.

---

## TL;DR – Stabiler Quickstart (v1.0 Vorbereitung)

```bash
# 1) Toolchain & Basis-Setup (optional, führt pnpm install aus)
./scripts/setup-dev-env.sh

# 2) Build & Smoke-Test (Dist-First)
pnpm build
pnpm start:light               # liefert dist/ auf http://127.0.0.1:3000 (Ctrl+C zum Beenden)

# 3) Governance & Kern-Checks
pnpm policy:check              # OPA + Guardrails + Kyverno
pnpm test:ts:ci
pnpm test:py
npx pyright

# 4) Monitoring-Profil (optional)
docker compose --profile monitoring up -d
# → Prometheus: http://localhost:9090, Grafana: http://localhost:3001

# 5) Hot-Reload UI (optional)
pnpm dev:ui                    # http://localhost:5173
```

> **Hinweise:**
> • `pnpm start:light` verwendet ausschließlich gebaute Artefakte aus `dist/` und prüft Content-Encoding (Brotli/Gzip).
> • Für produktive Vorschauen `pnpm build:ui && pnpm dev` ausführen; HMR bleibt über `pnpm dev:ui` verfügbar.
> • Windows: Lange Pfade aktivieren; `.dockerignore` im Repo-Root verhindert große Build-Kontexte.

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

**Core (CI Core / type-and-tests, verpflichtend für jeden PR)**

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
