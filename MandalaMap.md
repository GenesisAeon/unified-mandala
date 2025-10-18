# Mandala Map

- Version: 1.0
- Fraktal: 103
- Generated: 2025-12-12 00:00:00+00:00

Total entries: 78

Categories:

- automation: 12
- governance: 12
- ci-infra: 11
- agents: 8
- core-runtime: 8
- support: 6
- observability: 6
- data-intel: 5
- research: 5
- testing: 4
- backlog: 1
- defined categories: 11

Statuses:

- active: 60
- experimental: 7
- generated: 3
- stable: 3
- stub: 2
- system: 1
- backlog: 1
- in-progress: 1
- defined statuses: 8

Samples:

- automation:
  - Backlog Consolidate (active) — scripts/meta/backlog-consolidate.mjs
  - Verified Starter (active) — scripts/start-verified.ts
  - Plugin registry cache (active) — .registry/
  - Codex sync scripts (active) — codex-sync/
  - Fraktalrun pipelines (active) — fraktalrun/
  - Boundary Idempotency publisher (active) — src/boundary/publisher.ts (HTTP-Fallback sendet `Idempotency-Key`).
  - Boundary service observability update (active) — scripts/boundary-service.ts (`/metrics` zählt `boundary_observe_total{result="accepted|duplicate|invalid"}`, `boundary_idempotency_missing_total`; CORS exponiert `Idempotency-Key`).
  - Zero-build Vitest fallback (active) — packages/ai/package.json & vitest.config.ts (konditionale `vitest`/`test`/`development`-Exports, `resolve.conditions`).
- observability:
  - Ethics fail-closed service (active) — apps/ethics-api/src/index.ts (Circuit-Breaker, Ajv-Validierung, degradierte Header `x-ethics-degraded`, Lifeboat-Regeln, Boundary-Cache + einzigartige Evidenz-Domains, Prometheus-Counter `ethics_degraded_total`/`ethics_decision_log_total`).
- core-runtime:
  - Verify gate proxy (active) — apps/verify-gate/src/index.ts (Header-Drop-Liste, Request-ID, Rate/JSON-Limits (`VERIFY_GATE_JSON_LIMIT`, `VERIFY_GATE_RPS`), DNS-SSRF-Allowlist, Streaming-Proxy, Prometheus (`verify_gate_inflight`) & `/metrics`, `x-ethics-*`-Expose).
- governance:
  - Codex governance manifests (active) — codex/
  - Configuration bundles (active) — config/
  - Documentation (active) — docs/
  - Governance policies (active) — governance/
  - Manifest documents (active) — manifest/
- ci-infra:
  - GitHub workflows & templates (active) — .github/
  - MandalaMap strict (label gate) (active) — .github/workflows/mandala-map-strict.yml
  - Git hooks (active) — .husky/
  - AWS deployment stubs (active) — aws/
  - Helm charts (active) — charts/

_Auto-generated summary. Edit YAML as the source of truth._
