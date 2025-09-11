# CI Troubleshooting

- **Adapter builds fail**: ensure `CI=true` for offline fixtures and run `pnpm ci:adapters-offline`.
- **Pyright/tsc errors**: run `pnpm ci:fast-checks` locally to reproduce.
- **Missing correlation artifact**: run `python scripts/run_correlation.py` after adapter builds.
