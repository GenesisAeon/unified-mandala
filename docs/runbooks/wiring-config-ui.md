# Wiring: Config → UI (KPIs)
- Quelle: `config/climate-dashboard.yaml`
- Loader: `apps/ui/src/config/useClimateConfig.ts` (YAML via `?raw` & `yaml.parse`)
- Engine: `apps/ui/src/services/kpi-engine.ts` (Light/Mock zieht Werte aus ERA5/Pegel-Adaptern)
- UI: `apps/ui/src/components/KpiBoard.tsx`
## Test
1) YAML anpassen (Warn/Alarm/Label/Unit)
2) `pnpm dev:ui` (HMR) **oder** `pnpm build:ui && pnpm dev` (Port 3000)
3) Kacheln aktualisieren sich automatisch; Werte werden alle 10 s neu gepollt
