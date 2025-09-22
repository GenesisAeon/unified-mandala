# Trikāya Dashboard Prototype

_Generated: 2025-10-27T09:30:00.000Z_

## CREP Coverage

| Provider      | C     | R     | E     | P     | Ø CREP | Next | Dharmakāya | Sambhogakāya | Nirmāṇakāya |
| ------------- | ----- | ----- | ----- | ----- | ------ | ---- | ---------- | ------------ | ----------- |
| ChatGPT       | 0.910 | 0.900 | 0.880 | 0.900 | 0.897  | ✅   | ✅         | ✅           | ✅          |
| Mistral       | 0.920 | 0.880 | 0.900 | 0.860 | 0.890  | ⚠️   | ✅         | ✅           | ✅          |
| Claude        | 0.930 | 0.900 | 0.890 | 0.910 | 0.908  | ✅   | ✅         | ✅           | ✅          |
| Qwen          | 0.900 | 0.920 | 0.880 | 0.870 | 0.893  | ⚠️   | ✅         | ✅           | ✅          |
| Google Gemini | 0.930 | 0.910 | 0.890 | 0.920 | 0.912  | ✅   | ✅         | ✅           | ✅          |

## Aggregates

- **Average CREP**: C=0.918, R=0.902, E=0.888, P=0.892
- **Trikāya coverage**: Dharmakāya 5/5, Sambhogakāya 5/5, Nirmāṇakāya 5/5
- **Next-action rate**: 0.6

## Notes

- Data source: sigils/bridges/_/_.sigil.json processed via scripts/generate-trikaya-dashboard.mjs.
- CREP/Trikāya compliance reflects schema + semantic validation outcomes.
- Use `pnpm sigillins:authoring status --json` for CLI-friendly output.
- Refresh 2025-10-27 synchronisiert mit Fraktal64-Fixes (NetCDF-Engine-Fallback, STAC-HREF-Regression, QA-Analytics-Opt-out).
- Governance-Checks validieren `ciBehaviour`-Felder via `pnpm schema:validate`, `pnpm maps:validate`, `pnpm policy:check` und `pnpm sanity` (Fraktal65).
- Fraktal66: Policy-Suite behandelt Kyverno/Sigillin als optionale Schritte (`PANTHEON_DISABLE=1`), loggt Skip-Warnungen für fehlende Kyverno-CLI bzw. `sigillins:report`, Repo-Sanity akzeptiert Codexfeedback als YAML oder JSON und Repomap baut fallback-Artefakte bei fehlendem dist.

## CI Behaviour Snapshot

- Analytics toggle: `PANTHEON_DISABLE=1` deaktiviert QA-Analytics in CI-Jobs.
- Adapter-Backends: `netcdf4`, `h5netcdf` und `scipy` werden in Core/Extended/Nightly installiert.
- Governance Hooks: `pnpm schema:validate`, `pnpm maps:validate`, `pnpm policy:check` und `pnpm sanity` sichern die neuen Felder.
