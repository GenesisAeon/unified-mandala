# Beitragshinweise

## Core-Pipeline (Pflicht vor jedem PR)
- `pnpm lint`
- `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`

Diese Kombination entspricht exakt dem GitHub-Workflow **CI Core**. Er läuft auf jedem Push sowie jeder Pull-Request und muss lokal grün sein, bevor du review anforderst.

## Erweiterte Suites
- `pnpm test:ts:extended`
- `pnpm test:py:extended`
- `CI=true pnpm adapter:build:oisst`
- `CI=true pnpm adapter:build:era5`
- `pnpm stac:validate`
- `pnpm stac:validate:item out/example.item.json`
- `pnpm prompts:coach --dry`

Nutze diese Checks bei Bedarf (z. B. mit dem Label `run-extended`). Das Label `run-experimental` triggert zusätzlich die Experimente aus `ci.experimental.yml` und `zipmem-ci.yml`.

## GitHub-Actions-Status
- **Aktiv:** `ci.core.yml`, `ci.extended.yml`, `ci.experimental.yml`, `zipmem-ci.yml` (letzteres nur manuell oder mit `run-experimental`, `continue-on-error`).
- **Archiviert:** `fraktal21-ci`, `ci-fraktal22`, `agents`, `agents_ci`, `build-maps` → liegen als `.yml.disabled` vor. Zum Reaktivieren einfach zurückbenennen.

## Arbeitsweise
- Branch-Namen: `feature/<topic>` oder `fix/<topic>`.
- Conventional Commits.
- Mindestens ein Review vor Merge.

## Ethik & Feature Flags
- Siehe [AI_POLICY.md](AI_POLICY.md) für Richtlinien.
- Experimentelle Features immer hinter Flags halten (`ENABLE_EXPERIMENTAL_TESTS`, UI-Feature-Flags).
