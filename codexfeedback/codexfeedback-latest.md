# Codexfeedback – Fraktal 93

- Phase: Membrane v0.1 Activation & Sigillin Gatekeeping
- Status: RealMembrane heuristics merged; KPI bridge caches horizon state; sigillin:strict workflow in place (label gated).
- Next Hook: Promote sigil-message schema + expose membrane badge in Playground. Repeat Fraktal only if RealMembrane metrics drift in smoke runs.

What changed

- `src/membrane/real-membrane.ts`: implement RealMembrane v0.1 (windowed stats, hysteresis, debounce) and expose config knobs.
- `src/kpi/membrane-bridge.ts`: cache membrane per metric, reuse sigil + severity from live stream.
- Tests under `tests/membrane` + `tests/kpi` + `tests/unit`: golden-ish boundaries for A/ΔA, debounce, LOW_MEM bypass.
- `schemas/sigil-message.schema.json`: contract skeleton for downstream validation.
- `docs/membrane/real-membrane-v0.1.md`: decision record + verification checklist.
- `.github/workflows/sigillin-strict.yml`: optional CI gate triggered by PR label.

Validate

- `pnpm vitest run tests/membrane --run`
- `pnpm vitest run tests/kpi/membrane-bridge.test.ts --run`
- `pnpm vitest run tests/unit/membrane.null.test.ts --run`

Refs

- docs/roadmap/v1.0-stabilization-playbook.md
- MandalaMap.yaml / MandalaMap.json / MandalaMap.md
- DevTalk.txt (Membrane & Sigillin items)
