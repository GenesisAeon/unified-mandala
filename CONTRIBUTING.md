# Beitragshinweise

UnifiedMandala folgt einer „Core zuerst“-Strategie. Stabilität im Kern (Sigillin, CREP, Agenten-Basis, Climate-Dashboard) hat höchste Priorität – Experimente laufen getrennt über Feature-Flags und optionale CI-Schichten.

## Pflicht-Checks vor jedem Pull Request
- `pnpm test:ts:core`
- `npx tsc -p tsconfig.json --noEmit`
- `npx pyright`
- Falls Adapter/STAC betroffen sind: `pnpm test:ts:extended` + `CI=true pnpm adapter:build:oisst && CI=true pnpm adapter:build:era5`
- Optional für Experimente: `pnpm test:ts:experimental` (darf scheitern, Ergebnisse dokumentieren)

## CI-Schichten & Labels
- **Core CI** (`ci.core.yml`): required check; läuft auf jedem Push/PR.
- **Extended CI** (`ci.extended.yml`): automatisch nachts oder via PR-Label `run-extended`.
- **Experimental CI** (`ci.experimental.yml`): via Label `run-experimental`; Ergebnisse blockieren keinen Merge.
- Force-Pushes beenden laufende Pipelines dank Concurrency – bitte trotzdem kleine, fokussierte Commits erstellen.

## Feature-Flags & Umgebungsvariablen
- Serverseitige Flags: `UM_FEATURE_CLIMATE_CORE`, `UM_FEATURE_UNIVERSE_SIM`, `UM_FEATURE_QUANTUM`, `UM_FEATURE_TELEMETRY` (siehe `.env.example`).
- Vitest-Suiten: `UM_TEST_SUITE=core|extended|experimental` – Standard ist `core`.
- `LOW_MEM=1` reduziert Ressourcenverbrauch (Membrane deaktiviert, Tests laufen single-threaded).
- Neue Features bitte hinter einem Flag oder in `src/experimental/**` platzieren.

## Workflow
- Branches: `feature/<topic>`, `fix/<topic>` oder `docs/<topic>`.
- Commits: Conventional Commits (z. B. `feat:`, `fix:`, `docs:`).
- PRs klein und thematisch halten; Beschreibungen mit Hinweis auf betroffene Suite/Flag.
- Mindestens ein Review erforderlich. Reviewer sollen sicherstellen, dass Core-Checks grün sind.

## Dokumentation & Feedback
- README + `docs/roadmap/unifiedmandala-konsolidierung.md` aktuell halten.
- Status-Updates im `codexfeedback.(json|md|yaml)` ergänzen, damit Fraktalläufe nachvollziehbar bleiben.
- Onboarding regelmäßig testen (`scripts/onboarding-ritual.md` + Quickstart aus README) und Erkenntnisse festhalten.

Danke fürs Mitwirken – „Erst atmen, dann wachsen.“
