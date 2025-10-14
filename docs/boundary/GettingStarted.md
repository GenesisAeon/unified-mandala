# Boundary · Getting Started (Milestone A)

This slice reactivates the Boundary feature as buildable packages plus a tiny CLI.

## Packages

- `mandala/boundary-core`  
  Types (`BoundaryRule`, `BoundaryObservation`) and a simple in-memory `BoundaryRegistry`.

- `mandala/boundary-engine`  
  Discovery runtime: `Extractor` (regex-based) and `DiscoveryEngine` (runs rules on inputs and summarizes).

- `mandala/boundary-ui`  
  Minimal React table component `BoundaryLawInsightsUI` (Phase B wires a route).

## Build & Smoke

```bash
pnpm build:boundary
pnpm boundary:demo
# → writes data/logs/boundary/laws.demo.json and JSONL rollup
```

## Run with custom rules

Rules accept JSON (YAML optional if `yaml` is installed). Example:

```json
[
  {
    "id": "no-todo",
    "description": "No TODO markers",
    "severity": "warn",
    "pattern": "\\bTODO\\b"
  },
  {
    "id": "no-secret",
    "description": "No API_KEY in code",
    "severity": "error",
    "pattern": "API_KEY=.*"
  }
]
```

```bash
pnpm boundary:run --input scripts/boundary-demo.rules.json \
  --out data://logs/boundary/laws.json \
  --scan README.md --scan docs/DEV.md
```

Outputs:

```json
{
  "generated_at": "",
  "rules_count": 2,
  "observations_count": 4,
  "violations_count": 1,
  "summary": { "ok": 3, "warn": 1, "error": 0 },
  "laws": [
    /* BoundaryObservation */
  ]
}
```

## Next (Milestone B)

- UI route `/demo/boundary` embedding `BoundaryLawInsightsUI` and reading the latest snapshot from `data://logs/boundary/`.
- Optional: auto-index boundary logs into RAG (append mode) to make laws searchable.
