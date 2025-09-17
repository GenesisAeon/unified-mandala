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

## Governance & Policy Suite

- `pnpm policy:check` führt OPA (`policies/governance.rego`), Guardrails (`policies/merge-guardrails.yaml`) **und** den Kyverno-Dry-Run (`tools/kyverno-dry-run.mjs`) lokal aus und schreibt Ergebnisse nach `out/policy/`.
- Falls der Node-basierte Kyverno-Fallback nicht genutzt werden soll, kann er über `POLICY_SUITE_SKIP_KYVERNO=1 pnpm policy:check` deaktiviert werden. Ein separater Lauf ist via `pnpm kyverno:validate` möglich.
- Die Datei `out/policy/policy-suite-report.md` liefert eine Markdown-Zusammenfassung, die ebenfalls im GitHub Step Summary erscheint.
- Policy-Änderungen benötigen weiterhin begleitende Dokumentation (Guardrail-Regel) – idealerweise im gleichen PR aktualisieren.

## Workflow-Regeln

- Feature-Branches (`feature/xyz`) anlegen und anschließend per PR nach `main` mergen.
- Conventional Commits verwenden.
- Mindestens ein Review pro PR.
- `AI_POLICY.md` beachten (Einsatz von GPT, Datenumgang).
- Experimentelle Features hinter Feature-Flags halten (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`).
- Vor Merge einmal `pnpm build:ui` + `pnpm dev` (Smoke `/` → 200) prüfen.

## Code-Style & Tooling

- ESLint + Prettier laufen automatisch über Husky (`pnpm lint-staged`). Manuell: `pnpm lint` bzw. `pnpm format`.
- Bitte keine manuellen `ts-node` Aufrufe für Produktionspfade einchecken. Services werden in `dist/` vorkompiliert.
- Neue Skripte bevorzugt über `scripts/dev-services.mjs` einhängen, statt weitere `concurrently`-Aufrufe anzulegen.

## Dist-First Services

- `pnpm build` erstellt jetzt Node-Artefakte via `tsconfig.build.json`.
- Entwicklungsmodus: `pnpm dev:ui` (Vite) + `pnpm dev:services` (lokaler Proxy via `tsx`).
- Service-Cluster (lokal, mehrere APIs): `pnpm dev:cluster` (nutzt `scripts/dev-services.mjs`).
- Produktionsmodus: `pnpm start:services` (nutzt `node dist/...`).
- Falls beim Start Artefakte fehlen, zuerst `pnpm build` ausführen.
- Der Helper `scripts/run-dist.mjs` steckt hinter allen produktiven Skripten (`pnpm agents:health`, `pnpm sigils:lint`, …). Er prüft, ob das passende `dist/*.js` existiert, baut ansonsten automatisch und reicht zusätzliche Flags weiter.
- Für Spezialfälle:
  - `UM_RUN_DIST_SKIP_BUILD=1` → Skip Auto-Build (z. B. im CI nach vorherigem `pnpm build`).
  - `UM_RUN_DIST_BUILD_CMD="pnpm -r --filter mandala-ui build"` → alternatives Build-Kommando.
  - Direktaufruf: `node scripts/run-dist.mjs scripts/qa-test-runner.ts --suite smoke`.
