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

- `pnpm lint` (führt Typprüfung und ESLint zusammen aus)
- `pnpm format:check`
- `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`
- `pnpm policy:check -- --quiet` (liefert konsolidierten OPA/Kyverno/Guardrails-Report)

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
- Guardrail-Fehler (`tools/governance-guardrails.mjs`) bedeuten fehlende Dokumentation oder Issue-Referenzen bei Policy-Anpassungen und stoppen nun die Policy-Suite.
- Experimentelle Features hinter Feature-Flags halten (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`).
- Vor Merge einmal `pnpm build:ui` + `pnpm dev` (Smoke `/` → 200) prüfen.

## Code-Style & Tooling

- ESLint + Prettier laufen automatisch über Husky (`pnpm lint-staged`). Manuell: `pnpm lint` bzw. `pnpm format`.
- Bitte keine manuellen `ts-node` Aufrufe für Produktionspfade einchecken. Services werden in `dist/` vorkompiliert.
- Neue Skripte bevorzugt über `scripts/dev-services.mjs` einhängen, statt weitere `concurrently`-Aufrufe anzulegen.

## Dist-First Services

- `pnpm build` erstellt jetzt Node-Artefakte via `tsconfig.build.json`.
- Entwicklungsmodus: `pnpm dev:services` (nutzt `tsx`).
- Produktionsmodus: `pnpm start:services` (nutzt `node dist/...`).
- Falls beim Start Artefakte fehlen, zuerst `pnpm build` ausführen.
