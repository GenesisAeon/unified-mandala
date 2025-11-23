# Fraktal 88 – RUM UX, Map Gates, Backlog & Verified Start

Datum: 2025-10-13

## Summary

- RUM end-user UX rounded out:
  - Feature‑flagged RUM bootstrap with runtime controller (`window.__rum`).
  - Settings · RUM panel with collector + Grafana URL, validation, and inline toasts.
  - Topbar toggle with aligned toast and Explore deep‑link.
  - Metrics tile “Trace test”, Explore deep‑link, validity toasts and micro‑pulse highlight when Explore enables.
- Observability additions:
  - Grafana dashboard `grafana/dashboards/rum-traces.json` (Tempo, TraceQL).
  - Optional Tempo/OTEL compose under `docs/observability/`.
- Map & backlog automation:
  - `maps:sync` used in CI; label‑gated strict validation workflow `.github/workflows/mandala-map-strict.yml`.
  - Backlog consolidation script `scripts/meta/backlog-consolidate.mjs` + GitHub Action with artifact upload.
- Developer ergonomics:
  - `pnpm start:verified`: launches UI + stack + health, waits for readiness, then runs smoke.

## Files

- UI
  - `apps/ui/src/rum.ts`, `SettingsRUM.tsx`, `RumTopbarToggle.tsx`, `MetricsWidget.tsx`, `lib/grafana.ts`, `lib/uiBus.ts`, `env.d.ts`.
- Observability
  - `grafana/dashboards/rum-traces.json`
  - `docs/observability/docker-compose.tempo.yml`, `tempo/tempo.yaml`, `otel/otel-collector.yaml`.
- Automation/CI
  - `.github/workflows/backlog-consolidate.yml`, `.github/workflows/mandala-map-strict.yml`.
  - `scripts/meta/backlog-consolidate.mjs`, `scripts/start-verified.ts`.
- Docs/Maps
  - `MandalaMap.md/.yaml` updated; `docs/runbooks/command-catalog.*` entries added.

## Validation

- Typecheck: `npx tsc -p tsconfig.json --noEmit` OK; `npx pyright` OK.
- UI build: `pnpm -F mandala-ui build` OK.
- `pnpm maps:sync` validates MandalaMap artifacts.

## Next

- Optional: deep‑link Grafana Explore buttons to saved panel uid, or add a Tempo datasource provisioner.
- Consider unifying OpenTelemetry peer ranges across Node services.

