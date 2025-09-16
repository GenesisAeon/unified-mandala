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

- `pnpm lint` – ESLint gegen `src/**` und `apps/ui/**`
- `pnpm format:check` – Prettier-Konformität für `src/**` und `apps/ui/**` prüfen (Legacy-Abweichungen sind markiert und werden sukzessive bereinigt)
- `pnpm typecheck` – `tsc` ohne Emit
- `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`

## Code-Style & Build-Disziplin

- Husky führt bei jedem Commit automatisch `pnpm lint-staged` aus und überprüft dabei ESLint sowie Prettier auf den geänderten Dateien in `src/**` und `apps/ui/**`. Nutze bei Bedarf `pnpm lint:fix` und `pnpm format:write` lokal – beide Befehle sind auf die Core-Verzeichnisse begrenzt.
- Für lokale Service-Stacks steht `pnpm dev:services` bereit. Das Kommando verwendet `tsx` statt `ts-node` und bündelt RAG-, Flag-, Experiments-, Share- und Realtime-Hubs.
- Production-Builds laufen ausschließlich über vorkompilierte Artefakte (`pnpm build && node dist/...`). `ts-node` darf nicht in Produktions-Dockerfiles oder Compose-Services eingesetzt werden.
- Redundante Scripts vermeiden: neue CLI-Utilities werden als Subcommands oder optionale Flags zu bestehenden Tools ergänzt statt als eigenständige Shell-Fragmente angelegt.
- Feature-Flags dokumentieren (z. B. `ENABLE_EXPERIMENTAL_TESTS`) und in PR-Beschreibungen klar ausweisen.

## Erweiterte und experimentelle Suites

- **Extended** (Nightly oder Label `run-extended`):
  - `pnpm test:ts:extended`
  - `pnpm test:py:extended`
  - `CI=true pnpm adapter:build:oisst`
  - `CI=true pnpm adapter:build:era5`
  - `pnpm stac:validate`
  - `pnpm prompts:coach --dry`
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
