# Conscious-CI Ebenen

- **Core**: Typechecks (tsc/pyright), Policy-Prüfungen (OPA), Metrics-Bootstrap und Offline-Adapter-Smoke.
- **Extended**: STAC-Validate, Resonanz-Berechnung, Prompt-Lint (Dry-Run).
- **Experimental**: Agents-Dry-Run, Maps-Build, Governance-Extended.

Low-Mem und Offline sind Standard im CI. Nightly Jobs können ohne Low-Mem mit
mehreren Workern und Coverage laufen.
