# Conscious-CI Ebenen

- **Core** (`pnpm ci:core`): Typechecks (tsc/pyright), Vitest-Kernsuche, Metrics-Bootstrap und Offline-Adapter-Smoke.
- **Extended** (`pnpm test:ts:extended`, `pnpm test:py`): STAC-Validate, Resonanz-Berechnung, Prompt-Lint (Dry-Run).
- **Experimental** (`ci.experimental.yml` via Label): Agents-Dry-Run, Maps-Build, Governance-Extended.

Low-Mem und Offline sind Standard im CI. Nightly Jobs können ohne Low-Mem mit
mehreren Workern und Coverage laufen.

Aktueller Konsolidierungsplan: [docs/Konsolidierungsplan-UnifiedMandala.md](Konsolidierungsplan-UnifiedMandala.md) (Fraktal37). Jede Ebene dokumentiert ihren Status zusätzlich in `advancedprogress.json -> consolidationPlan`.
