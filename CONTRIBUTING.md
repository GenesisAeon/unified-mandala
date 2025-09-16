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

- `pnpm lint` (TypeScript, `tsc --noEmit`)
- `pnpm format:check -- --staged` (prüft die aktuell gestagten Dateien; ohne Argumente vergleicht der Check gegen `HEAD`)
- `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`
- Optional: `pnpm lint:eslint` für gezielte Lints in `apps/`, `packages/`, `scripts/`, `services/`, `src/`, `tests/`

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

## Code-Style & Hooks

- Husky führt vor jedem Commit `pnpm lint-staged` aus und sorgt dafür, dass ESLint-Fixes und Prettier-Formatierungen direkt auf den geänderten Dateien landen.
- `pnpm lint` führt den TypeScript-Lauf (`pnpm lint:types`) ohne Emission aus; `pnpm lint:eslint` deckt fokussiert `apps/`, `packages/`, `services/`, `scripts/`, `src/`, `tests/` ab.
- `pnpm format` formatiert das gesamte Repo; `pnpm format:check` liest Git-Diffs (Default: `HEAD`, mit `-- --staged` nur Stage) und prüft die betroffenen Dateien.

## GitHub-Actions Überblick

- `CI Core` läuft bei jedem Push/PR auf `main`.
- `CI Extended` läuft nightly oder wenn der PR das Label `run-extended` trägt.
- `CI Experimental` läuft nur bei gesetztem Label `run-experimental`.
- Historische Pipelines (Fraktal21/22, Agents, Maps, ZIPMEM) sind unter `.github/workflows/*.disabled` archiviert und verursachen keine Checks mehr. Bei Bedarf einfach zurück benennen.

## Dist-First & Script Hygiene

- Produktions-Builds nutzen vorkompilierte Artefakte (`node dist/...`). `ts-node`/`tsx` bleiben lokalen Werkzeugketten vorbehalten.
- Docker- und Compose-Services werden sukzessive auf dist-first umgestellt. Neue Services bitte direkt mit Build-Schritt planen.
- Redundante Skripte vermeiden: vorhandene Runner (z. B. `scripts/dev-server.ts`) erweitern statt neue ts-node-Einstiegspunkte anzulegen.

## Workflow-Regeln

- Feature-Branches (`feature/xyz`) anlegen und anschließend per PR nach `main` mergen.
- Conventional Commits verwenden.
- Mindestens ein Review pro PR.
- `AI_POLICY.md` beachten (Einsatz von GPT, Datenumgang).
- Experimentelle Features hinter Feature-Flags halten (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`).
- Vor Merge einmal `pnpm build:ui` + `pnpm dev` (Smoke `/` → 200) prüfen.
- Keine `ts-node`/`tsx`-Kommandos im Produktionsbetrieb – Releases laufen auf kompilierten `dist`-Artefakten.
- Doppelte oder veraltete Scripts aus `package.json`/`scripts/` entfernen statt neue Varianten anzuhängen.
