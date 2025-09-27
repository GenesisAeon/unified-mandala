---
name: MandalaMap Strict Rollout
about: Track rollout to strict MandalaMap validation without breaking CI
title: 'MandalaMap: strict validation rollout'
labels: [meta, mandala-map, strict-plan]
assignees: []
---

Context

- Gentle checks run locally and in CI.
- Strict validation exists but is label-gated (`mandala-strict`) to avoid breaking CI during cleanup.

Plan

1. Phase 1 — Content hygiene (local)
   - [ ] Run `pnpm meta:mandala:validate` and fix reported issues.
   - [ ] Run `pnpm meta:mandala:sync` (JSON/MD from YAML), then validate again.
   - [ ] Ensure MandalaMap entries use defined `legend.categories`/`legend.status` keys.
   - [ ] Run `pnpm meta:fraktal:organize` and verify `docs/fraktal/index.md`.

2. Phase 2 — Soft CI (observe only)
   - [ ] Monitor `MandalaMap Check` workflow on new PRs (no failures expected, warnings ok).
   - [ ] Create small PRs to converge drift (owners + reviewers below).

3. Phase 3 — Label-gated strict
   - [ ] On 2–3 PRs add label `mandala-strict` and ensure strict passes.
   - [ ] Iterate until strict is green consistently.

4. Phase 4 — Default strict
   - [ ] Flip CI to fail on strict by default (remove `continue-on-error` and keep label job as redundant or remove).
   - [ ] Announce in `CHANGELOG.md` and update `docs/DEV.md`.

Acceptance Criteria

- [ ] `meta:mandala:validate` shows OK locally.
- [ ] `meta:mandala:validate:strict` passes for labeled PRs.
- [ ] No undefined categories/status in `entries`.
- [ ] JSON/MD are in sync with YAML in `main`.

Owners

- Primary: Codex CoreOps, Repositorypflege Collective
- Reviewers: QualityAssuranceAgent, SyncRunner, PactDepthGatekeeper

Notes

- Optional strict pre-commit: set `UM_STRICT_META=1` locally to enforce before committing.
- Fraktal docs are organized automatically by pre-commit; redirects are created at old paths.
