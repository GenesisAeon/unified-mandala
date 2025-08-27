# Handbuch – UnifiedMandala · v1.0

> Kanon für Architektur, Betrieb und Ethik

## TL;DR

UnifiedMandala → **symbolische KI + CREP + Agenten** auf einer gemeinsamen, ethisch fundierten Plattform.  
Praktisch: Climate-Dashboard, Archive-/Frequency-UIs, Orchestrierung, ToDo-Sync, Offline-Bundle.

**Sofortstart (Dev)**
```bash
pnpm install
pnpm dev:ui          # UI mit HMR, :5173
pnpm build:ui
pnpm dev             # Backend liefert UI auf :3000
```

**Offline**
```bash
docker compose -f docs/offline/docker-compose.yml build
docker compose -f docs/offline/docker-compose.yml up
```

---

## 1. Architektur

### 1.1 Schichten
- **Sigillin**: Symbolische Interaktion, Zustandsphasen, Loader  
- **CREP**: Kohärenz/Resonanz/Emergenz/Poetik – Evaluationslogik  
- **Agenten**: Sensorik, Analytik, Synthese, Governance  
- **UI/Dashboards**: Climate, Archive, Frequency  
- **Pipelines**: ETL → Normalisierung → MRV/STAC

### 1.2 Datenfluss (vereinfachte Kette)
Ingest → `src/adapters/*` → `src/utils/*` → KPIs/Alarme → MRV/STAC → UI/Exports

### 1.3 Zustände & Rituale
Sigil-Zyklen, CREP-Evaluation, Agenten-Aktionen (z. B. Climate-Alarmkette)

---

## 2. Runbooks

### 2.1 Entwicklung
1) Node 20+, pnpm (corepack)  
2) `pnpm install`  
3) UI Dev: `pnpm dev:ui` → `:5173`  
4) Backend + statische UI: `pnpm build:ui && pnpm dev` → `:3000`

### 2.2 Offline-Bundle
Compose: `docs/offline/docker-compose.yml` → `up`

### 2.3 Climate-Adapter
- Config: `src/config/climate-dashboard.yaml`  
- ERA5/OISST/EFFIS/Pegel/Biodiv/Radar/SPEI → `src/adapters/*`  
- Utils: `src/utils/*` (Resampling, Z-Scores, MRV/STAC)

### 2.4 Tests/CI
- `pnpm -r test`, `pnpm -r lint`  
- CI: Build UI, Smoke `/`, optional CodeQL

---

## 3. Governance & Ethik

- **HI-Compact:** `docs/governance/HI-Compact.md`  
- **A/B-Policy:** `docs/policies/ab-test.yaml`  
- **Incident-Playbook:** `docs/runbooks/incident-playbook.md`  
- **Post-Action-Review:** `docs/runbooks/post-action-review.md`

---

## 4. Security & Compliance

- Secrets via `.env` (Beispiel `.env.example`)  
- Datenquellen: Lizenzen/Rate Limits beachten  
- Optional CodeQL in GitHub Actions

---

## 5. Glossar

CREP · Sigillin · MRV/STAC · Hydro-Whiplash · Shadow-Mode · A/B-Test
