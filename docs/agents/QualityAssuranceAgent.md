# QualityAssuranceAgent

## Responsibilities
- Führt Lint- und Test-Suites für alle Pakete aus.
- Speichert Ergebnisse in `qa-report.log`.

## Parameters
- `lintCommand` – Standard: `pnpm lint`.
- `testCommand` – Standard: `pnpm test`.

## Example usage
```bash
ts-node scripts/qa-test-runner.ts
```
