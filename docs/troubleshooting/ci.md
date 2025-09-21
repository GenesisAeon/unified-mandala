# CI Troubleshooting

- **Adapter builds fail**: run `pnpm ci:adapters-offline` (uses `cross-env` for Windows/macOS/Linux) to replay the offline fixtures.
- **Pyright/tsc errors**: run `pnpm ci:fast-checks` locally to reproduce.
- **Missing correlation artifact**: run `python scripts/run_correlation.py` after adapter builds.
