# Codexfeedback – Fraktal 96

- Phase: Boundary Dedupe Canonicalization & Ops Metrics follow-through
- Status: stableBoundaryEventKey canonicalizes payloads, boundary-service writes snapshots atomar und zählt HTTP-Statuscodes (`boundary_http_responses_total`) für dedizierte Alerts; Vitest deckt die Canonicalisierung ab.
- Next Hook: Roll canonical helper into remaining ingest/export scripts und beobachten Prometheus-Alerts (Dedupes/min vs. 202/409 Ratio) für Replay-Spitzen.

What changed

- `packages/boundary-core/src/canonical.ts` · New helper normalises payload objects (sort keys, guard circular refs, handle non-finite numbers) for deterministic hashing.
- `packages/boundary-core/src/event-key.ts` · Uses canonical payload serialisation when building SHA1 keys; vitest contract ensures reordered keys hash identically.
- `packages/boundary-core/src/index.ts` · Exports the canonical helper for downstream consumers.
- `packages/boundary-core/src/__tests__/event-key.test.ts` · Covers payload reordering and circular/non-finite edge-cases.
- `scripts/boundary-service.ts` · Writes `laws.json` atomar (`.tmp` → rename), increments `boundary_http_responses_total` per status und meldet Snapshot-Write-Fehler als 500.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Observability-Abschnitt ergänzt den Canonical-Hardening-Eintrag mit HTTP-Status-Counter & Atomic Snapshots.
- `MandalaMap.(md|json|yaml)` · Meta auf Fraktal96 gehoben, Automation-Cluster referenziert Canonical Hardening & boundary-service Link.
- `codexfeedback.(md|json|yaml)` & `codexfeedback/codexfeedback-latest.(json|yaml)` · Tracker aktualisiert (Fraktal96 done, Hook = Alert-Monitoring & Publisher-Rollout).
- `docs/fraktal/codexfeedback/codexfeedback-fraktal96.yaml` · Neuer Log-Eintrag für diesen Lauf.

Validate

- `pnpm vitest run packages/boundary-core/src/__tests__/event-key.test.ts`
- `pnpm vitest run packages/boundary-engine`
- `node scripts/smoke/boundary-service-smoke.mjs`

Refs

- docs/roadmap/v1.0-stabilization-playbook.(md|yaml)
- MandalaMap.(md|json|yaml)
- packages/boundary-core/src/event-key.ts
- packages/boundary-core/src/canonical.ts
- packages/boundary-core/src/**tests**/event-key.test.ts
- scripts/boundary-service.ts
