# Codexfeedback – Fraktal 95

- Phase: Sigil Runtime Guard & Membrane OpsPanel Integration · Boundary Dedupe runtime hardening
- Status: Boundary smoke enforces `eventKey` coverage, boundary-service dedupes runtime events (409 duplicate_eventKey + Prometheus counter/gauge) and Grafana tiles surface dedupe health.
- Next Hook: Roll stable eventKey derivation into remaining publishers/bridges and monitor dedupe counters for replay spikes.

What changed

- `scripts/smoke/boundary-smoke.mjs` · Added JSON helper exports plus `eventKey` dedupe validation and CLI exit codes for missing/duplicate keys.
- `tests/smoke/boundary-smoke.spec.ts` · Covers snapshot extraction, missing key detection, duplicate detection and happy-path validation.
- `docs/runbooks/sigil-publisher.md` · Runbook describing how to integrate `publishSigilMessage`, boundary coupling and snapshot expectations.
- `scripts/boundary-service.ts` · Enforces TTL-based dedupe, validates eventKey hashes, skips JSONL/Snapshot writes on duplicates and exports Prometheus counter/gauge.
- `scripts/smoke/boundary-service-smoke.mjs` · Smoke asserts 202/409 behaviour and verifies `boundary_law_deduped_total` via `/metrics`.
- `packages/boundary-core/src/event-key.ts`, `packages/boundary-engine/src/extractor.ts`, `src/boundary/publisher.ts` · Provide shared stable eventKey hashing and ensure observations/publishers attach the hash.
- `grafana/dashboards/boundary.json`, `grafana/dashboards/boundary-health-patch.json` · Add Dedupes/min and dedupe cache size tiles.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Observability stream notes Fraktal95 update (boundary smoke + runbook).
- `MandalaMap.(md|json|yaml)` · Generated timestamp refreshed; automation scripts entry references boundary dedupe + runbook.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal95.yaml`, `codexfeedback.(md|json|yaml)` · Marked Fraktal95 as done and updated progress hooks.

Validate

- `pnpm vitest run tests/smoke/boundary-smoke.spec.ts`
- `pnpm vitest run packages/boundary-engine`
- `node scripts/smoke/boundary-service-smoke.mjs`

Refs

- docs/runbooks/sigil-publisher.md
- docs/roadmap/v1.0-stabilization-playbook.(md|yaml)
- MandalaMap.(md|json|yaml)
- scripts/smoke/boundary-smoke.mjs
- scripts/boundary-service.ts
- scripts/smoke/boundary-service-smoke.mjs
- grafana/dashboards/boundary.json
- grafana/dashboards/boundary-health-patch.json
