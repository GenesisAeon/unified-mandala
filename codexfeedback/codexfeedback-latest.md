# Codexfeedback – Fraktal 93

- Phase: Membrane Hardening & Sigillin Contract Wiring
- Status: RealMembrane telemetry + boundary hooks aktiv, Sigillin-Contract testet Schema, UI-Pill vorbereitet.
- Next Hook: UI-Verdrahtung (`MembranePill`), Schema in `pnpm schema:validate`, Boundary-Smoke aktualisieren.

What changed

- `src/membrane/config.ts` · ENV-gesteuerte Defaults (`MEMBRANE_CFG`), Cache-TTL und CI-ASCII Guard.
- `src/membrane/real-membrane.ts` · Metrics/Tracing Hook, Legacy-Config-Normalisierung, deterministische Step-Pipeline.
- `src/membrane/metrics.ts` + `registry.ts` · Prometheus Counter/Histogram + TTL-Cache je KPI.
- `src/kpi/membrane-bridge.ts` · Boundary-Events bei Event/Recovery, Rückgabe liefert A/ΔA/State/Enabled.
- `src/boundary/publisher.ts` · Gemeinsamer Publisher mit optionalem Fetch-Hook (`BOUNDARY_ENDPOINT`).
- Tests (`tests/membrane/*`, `tests/kpi/membrane-bridge.test.ts`, `tests/sigil/schema.contract.test.ts`) decken Golden, CI-ASCII, Schema-Vertrag, Boundary-Emissionen ab.
- `apps/ui/src/components/MembranePill.tsx` · UI-Mikrosignal (Tone + Tooltip) für A/ΔA/State.
- `docs/membrane/real-membrane-v0.1.md` · What-changed Nugget für Operator:innen.
- `analysis/devtalk93-evaluation.md` · Abgleich DevTalk93 (erledigt/offen) + nächste Befehle.

Validate

- `pnpm vitest run tests/membrane --run`
- `pnpm vitest run tests/kpi/membrane-bridge.test.ts --run`
- `pnpm vitest run tests/sigil/schema.contract.test.ts --run`

Refs

- docs/roadmap/v1.0-stabilization-playbook.md / .yaml
- MandalaMap.(md|json|yaml)
- DevTalk.txt (Membrane/Sigillin Abschnitt)
