# Changelog — go-agent

## [0.1.0] — 2026-07-26

### Added

- Initial governance documentation (`GOVERNANCE.md`): documents the
  real vs. placeholder split (`pkg/dispatcher`/`internal/auth`/
  `pkg/metrics` real and tested; `pkg/scheduler`'s polling loop
  explicitly a placeholder), corrects the assumed Python-ecosystem
  relationship (no verified link found — `go-bridge`, not `go-agent`,
  is the one with a real Node/TS API integration), and flags the
  `github.com/unified-mandala/...` vs. `github.com/GenesisAeon/...`
  module-path inconsistency with `go-bridge`.
- Semantic versioning established, starting at `v0.1.0` (the code
  itself predates this tag — this documents the existing state, not a
  new feature).

### Context

Go-based task-execution daemon in the `unified-mandala` monorepo —
worker-pool dispatcher with retry/backoff, HashiCorp Vault auth,
Prometheus metrics, and a NATS-based scheduler (self-described in its
own `README.md` as a "Scaffold" with "Scheduler, Dispatcher und
Handler-Stubs").
