# fraktal21: zero-warn typing, STAC strict++, offline adapters, resonance+emergence, prompt-coach, epistemic

## Changes
- Pyright strict 0-warn via shared types + fixtures
- STAC strict++ schema + Ajv validator
- Deterministic offline builds (2×2×2) + CI cache
- Resonance CLI via tsx + paths; Emergence Explorer (flagged)
- Prompt Coach (heuristic) + PR comment (dry run)
- Epistemic evidence + Bayes + ConfidenceSigil

## Verification
- [ ] `npx pyright`
- [ ] `npx tsc --noEmit` + `pnpm vitest run`
- [ ] `CI=true pnpm adapter:build:oisst && era5`
- [ ] `pnpm stac:validate && pnpm stac:validate:item`
- [ ] `pnpm resonance:calc`
- [ ] Emergence Explorer behind `VITE_FEATURE_EMERGENCE_EXPLORER=on`
- [ ] Prompt Coach output in `prompts/.optimized/` + `.diff/`

## Notes / Follow-ups
- Switch Prompt-Coach to real Optimizer API
- EFFIS live + correlations batch → `out/correlations.json`
