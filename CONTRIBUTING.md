# Beitragshinweise

## CI-Testlayer

### Core (Pflicht für jeden PR)
- Spiegle die GitHub-Actions-Umgebung lokal mit `OFFLINE=1` und `LOW_MEM=1`, damit keine Netzwerkanfragen oder speicherhungrigen Pfade in den Core-Lauf rutschen.
- Pflichtbefehle vor jedem Pull Request:
  ```bash
  pnpm lint
  OFFLINE=1 pnpm test:ts:ci
  OFFLINE=1 pnpm test:py
  npx pyright
  ```
- `pnpm lint` ruft `tsc --noEmit` auf, `pnpm test:py` führt `pytest -m "not slow and not experimental" -q` aus. Stelle sicher, dass Core-Tests ohne externe Ressourcen funktionieren.

### Extended (Nightly & Label `run-extended`)
- Läuft automatisch im Nightly-Cron (`02:00 UTC`) oder wenn ein Pull Request das Label `run-extended` erhält.
- Enthält Integrations- und Adapterpfade. Kennzeichne aufwändige Python-Tests mit `@pytest.mark.slow` und TypeScript-Tests als `*.extended.test.ts`, damit sie nur in dieser Suite landen.
  ```bash
  pnpm test:ts:extended
  pnpm test:py:extended
  PYTHONPATH=src pnpm adapter:build:oisst
  PYTHONPATH=src pnpm adapter:build:era5
  pnpm stac:validate
  ```
- Offline-Fallback-Daten gehören nach `fixtures/` oder `data/raw`. Nutze `CI=true`/`OFFLINE=1`, wenn Build-Skripte Network-Zugriffe abstellen müssen.

### Experimental (Label `run-experimental`)
- Wird nur manuell über das Label `run-experimental` ausgelöst. Hier dürfen instabile Checks leben.
  ```bash
  pnpm test:ts:experimental
  pnpm test:py:all
  pnpm agents:dry-run --verbose
  pnpm guardrails:validate
  ```
- Verwende Feature-Flags (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`), damit Experimental-Code den Core nicht beeinflusst.

## Workflow-Übersicht

| Workflow | Datei | Trigger | Inhalt |
| --- | --- | --- | --- |
| CI Core | `.github/workflows/ci.core.yml` | push & pull_request | TypeScript-Compile, Vitest Core, Pytest Core, Pyright. Node 22.x & Python 3.11 unter OFFLINE-Bedingungen. |
| CI Extended | `.github/workflows/ci.extended.yml` | nightly (02:00 UTC) oder Label `run-extended` | Extended Vitest/Pytest, OISST & ERA5 Adapter-Builds, STAC + Resonanz-Smoke. |
| CI Experimental | `.github/workflows/ci.experimental.yml` | Label `run-experimental` | Agents-Dry-Run & Kyverno-Guardrails; tolerant gegenüber Fehlschlägen (`|| true`). |
| Policy & Governance | `.github/workflows/policy-check.yml`, `.github/workflows/governance-check.yml` | push & PR | Stellt Compliance sicher; bleiben Teil des Core-Gates. |
| ZIPMEM CI | `.github/workflows/zipmem-ci.yml` | push & PR | Läuft weiter, zählt dank `continue-on-error: true` aber nicht mehr als Blocker. |

> Legacy-Pipelines (`fraktal21-ci`, `ci-fraktal22`, `fraktal-ci`, `agents`, `agents_ci`, `build-maps`) wurden nach `.disabled` verschoben und laufen nicht mehr automatisch. Bei Bedarf lassen sie sich durch Rückbenennen reaktivieren.

## Contribution Flow

- Arbeite auf Feature-Branches (`feature/<thema>`), Rebase statt Merge-Commits bevorzugt.
- Nutze Conventional Commits (z. B. `feat:`, `fix:`, `docs:`).
- Mindestens ein Review vor dem Merge; dokumentiere besondere Migrationsschritte im PR-Text.
- Experimentelle Features hinter Flags halten und in der Doku vermerken.
- Lies [AI_POLICY.md](AI_POLICY.md) und respektiere die Richtlinien zum Umgang mit Daten & GPT-Assistenzen.

## Test-Markierungen & Datenhygiene

- TypeScript: Extended/Experimental-Suites werden über Dateisuffixe (`*.extended.test.ts`, `*.experimental.test.ts`) und die Umgebungsvariablen `ENABLE_EXTENDED_TESTS` / `ENABLE_EXPERIMENTAL_TESTS` gesteuert.
- Python: Verwende `@pytest.mark.slow` und `@pytest.mark.experimental`, damit Core- und Extended-Läufe korrekt filtern (`pytest.ini`).
- Offline-Daten klein halten; große Artefakte in Git LFS oder automatisierte Downloads auslagern, die in Extended/Experimental gebaut werden.
- Nach jedem Lauf temporäre Verzeichnisse wie `tests/tmp-*` sowie `__pycache__` entfernen, damit der Arbeitsbaum sauber bleibt.
