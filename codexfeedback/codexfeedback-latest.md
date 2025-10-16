# Codexfeedback – Fraktal 95

- Phase: Sigil Runtime Guard & Membrane OpsPanel Integration · Boundary Dedupe follow-up
- Status: Boundary smoke enforces `eventKey` coverage, helper tests guard dedupe logic and the Sigil publisher runbook documents multi-bridge integration. Remaining optional hook: automate RAG index refresh once additional sigil feeds arrive.
- Next Hook: Monitor boundary law exports (laws.json/laws.demo.json) for missing keys and extend publisher roll-out to remaining bridges when they adopt the runtime guard.

What changed

- `scripts/smoke/boundary-smoke.mjs` · Added JSON helper exports plus `eventKey` dedupe validation and CLI exit codes for missing/duplicate keys.
- `tests/smoke/boundary-smoke.spec.ts` · Covers snapshot extraction, missing key detection, duplicate detection and happy-path validation.
- `docs/runbooks/sigil-publisher.md` · Runbook describing how to integrate `publishSigilMessage`, boundary coupling and snapshot expectations.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Observability stream notes Fraktal95 update (boundary smoke + runbook).
- `MandalaMap.(md|json|yaml)` · Generated timestamp refreshed; automation scripts entry references boundary dedupe + runbook.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal95.yaml`, `codexfeedback.(md|json|yaml)` · Marked Fraktal95 as done and updated progress hooks.

Validate

- `pnpm vitest run tests/smoke/boundary-smoke.spec.ts`

Refs

- docs/runbooks/sigil-publisher.md
- docs/roadmap/v1.0-stabilization-playbook.(md|yaml)
- MandalaMap.(md|json|yaml)
- scripts/smoke/boundary-smoke.mjs
