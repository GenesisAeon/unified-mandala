# Mandala Map

- Version: 1.0
- Fraktal: 88
- Generated: 2025-11-30 00:00:00+00:00

Bridges index: sigils/bridges/bridges.index.yaml

Total entries: 71

Categories:

- governance: 12
- ci-infra: 10
- automation: 10
- agents: 8
- core-runtime: 7
- support: 6
- data-intel: 5
- research: 5
- testing: 4
- observability: 3
- backlog: 1
- defined categories: 11

Statuses:

- active: 53
- experimental: 7
- generated: 3
- stable: 3
- stub: 2
- system: 1
- backlog: 1
- in-progress: 1
- defined statuses: 8

Samples:

- governance:
  - Codex governance manifests (active) — codex/
  - Configuration bundles (active) — config/
  - Documentation (active) — docs/
  - Governance policies (active) — governance/
  - Manifest documents (active) — manifest/
- ci-infra:
  - GitHub workflows & templates (active) — .github/
  - Git hooks (active) — .husky/
  - AWS deployment stubs (active) — aws/
  - Helm charts (active) — charts/
  - CI support scripts (active) — ci/
- automation:
  - Plugin registry cache (active) — .registry/
  - Codex sync scripts (active) — codex-sync/
  - Fraktalrun pipelines (active) — fraktalrun/
  - Integration helpers (active) — integration/
  - Process automation (active) — processes/

_Auto-generated summary. Edit YAML as the source of truth._

## Recent Additions

- Observability: RUM Traces dashboard (`grafana/dashboards/rum-traces.json`), optional local Tempo/OTEL compose under `docs/observability/`.
- Automation: Backlog Consolidate (`scripts/meta/backlog-consolidate.mjs`, `pnpm backlog:consolidate`), GitHub Action uploads artifacts on changes.
- Automation: Verified Starter (`scripts/start-verified.ts`, `pnpm start:verified`) launches UI + dev stack + health, waits, then runs smoke.
- CI Infra: MandalaMap strict label-gated workflow (`.github/workflows/mandala-map-strict.yml`).
