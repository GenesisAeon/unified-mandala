# Changelog — go-bridge

## [0.1.0] — 2026-07-26

### Added

- Initial governance documentation (`GOVERNANCE.md`): documents the
  verified real integration with `apps/sharedream-interface`'s
  `/api/meta-scores` Next.js route (confirmed to exist, not assumed),
  flags that the `crep.events` NATS subject has a consumer
  (`mandala-cli crep watch`) but no verified producer anywhere in this
  repo, and notes the `MetaScoreService` gRPC service has generated
  client code but no verified server implementation. Corrects the
  assumed Python-ecosystem relationship — the real integration point
  is Node/TypeScript, not a Python package.
- Semantic versioning established, starting at `v0.1.0` (the code
  itself predates this tag).

### Context

Go-based polyglot client SDK and CLI (`mandala-cli`) for
`unified-mandala` — REST/gRPC clients, a NATS event-bus consumer, and
`meta-scores get`/`crep watch` commands. Installable standalone via
`go install github.com/GenesisAeon/unifiedmandala-go/cmd/mandala-cli@latest`.
