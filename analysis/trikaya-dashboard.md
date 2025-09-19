# Trikāya Dashboard Prototype

_Generated: 2025-09-19T18:18:37.150Z_

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
