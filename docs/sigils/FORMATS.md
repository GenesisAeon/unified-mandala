# Sigillin Formats (Supported)

- **CREP** akzeptiert:
  - `score: <0..1>`
  - `C/R/E/P` (uppercase) je 0..1
  - `coherence/resonance/emergence/poetics` (lowercase) je 0..1
- Der Indexer normalisiert und **preservt** vorhandene Werte.
- Bei Parserfehlern: `out/sigils_errors.json` prüfen; im CI `pnpm sigils:index:strict`.

## Metrics (automatisch berechnet)
- `connectionDensity`
- `emergencePotential`
- `lifecycle`
- `class` (`high` | `medium` | `low`)
