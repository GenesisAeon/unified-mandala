# Beitragshinweise

## Core-Checks lokal spiegeln

Um die **CI Core / type-and-tests** Jobs lokal nachzustellen, setze vor den Befehlen die gleichen Variablen wie im Workflow:

```bash
export OFFLINE=1
export LOW_MEM=1
export VITE_LOW_MEM=on
export PYTHONPATH=src
```

Danach sollten folgende Schritte immer grün sein, bevor ein PR erstellt wird:

- `pnpm lint`
- `pnpm format:check`
- `npx tsc -p tsconfig.json --noEmit`
- `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`

## Erweiterte und experimentelle Suites

- **Extended** (Nightly oder Label `run-extended`):
  - `pnpm test:ts:extended`
  - `pnpm test:py:extended`
  - `CI=true pnpm adapter:build:oisst`
  - `CI=true pnpm adapter:build:era5`
  - `pnpm stac:validate`
  - `pnpm prompts:coach --dry`
  - `pnpm exec node tools/schema-validate.mjs`
  - `pnpm exec node tools/governance-check.mjs`
- **Experimental** (Label `run-experimental` oder manuell):
  - `pnpm test:ts:experimental`
  - Weitere Jobs nur nach Abstimmung, Ergebnisse werden toleriert (continue-on-error).

## GitHub-Actions Überblick

- `CI Core` läuft bei jedem Push/PR auf `main`.
- `CI Extended` läuft nightly oder wenn der PR das Label `run-extended` trägt.
- `CI Experimental` läuft nur bei gesetztem Label `run-experimental`.
- Historische Pipelines (Fraktal21/22, Agents, Maps, ZIPMEM) sind unter `.github/workflows/*.disabled` archiviert und verursachen keine Checks mehr. Bei Bedarf einfach zurück benennen.

## Workflow-Regeln

- Feature-Branches (`feature/xyz`) anlegen und anschließend per PR nach `main` mergen.
- Conventional Commits verwenden.
- Mindestens ein Review pro PR.
- `AI_POLICY.md` beachten (Einsatz von GPT, Datenumgang).
- Experimentelle Features hinter Feature-Flags halten (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`).
- Vor Merge einmal `pnpm build:ui` + `pnpm dev` (Smoke `/` → 200) prüfen.
- `pnpm lint:staged` wird automatisch als Pre-Commit-Hook ausgeführt; bei Bedarf manuell starten.
- Services für Production-Tests ausschließlich über Dist-Artefakte betreiben (`pnpm build:dist`, danach `pnpm start:services`). Kein `ts-node`/`tsx` im Release-Image.
- Governance-Dry-Runs (`pnpm exec node tools/schema-validate.mjs`, `pnpm exec node tools/governance-check.mjs`) müssen im Extended-Lauf grün sein – die Workflows brechen nun ohne `continue-on-error` ab.
