PR Checklist

- [ ] Update codexfeedback: `codexfeedback.md`, `codexfeedback.json`, `codexfeedback.yaml`
- [ ] Update roadmap: `docs/roadmap/v1.0-stabilization-playbook.md`, `docs/roadmap/v1.0-stabilization-playbook.yaml`
- [ ] Update MandalaMap artifacts: `MandalaMap.md`, `MandalaMap.json`, `MandalaMap.yaml`
- [ ] Update Fraktal‑Tagebuch (Fraktal‑Diary) with relevant notes
- [ ] Run tests (`pnpm test:unit`) and type checks (`npx tsc`, `npx pyright`)
- [ ] Verify dev stack (`pnpm start:all`) and health (`http://localhost:3999/health`)
- [ ] Optional: add PR label `mandala-strict` to enforce strict MandalaMap validation in CI
