# UnifiedMandala Stabilisierung · Fraktal38

Dieser Leitfaden fasst die technischen Erkenntnisse aus Fraktal38 zusammen und macht sie als Arbeitsplan für das Release v1.0 greifbar. Er ergänzt den Konsolidierungsfahrplan aus Fraktal37 und fokussiert konkret auf Build-Stabilität, Governance-Checks und Teamrituale.

## Repository- und Architekturdiagnose

- **Monorepo via pnpm**: Workspaces bündeln `apps/*`, `src`, `packages/*` und `services/*` in einem Node-20-Ökosystem. (siehe pnpm-workspace.yaml)
- **Build- und Service-Orchestrierung**: `package.json` liefert dist-first Builds (`pnpm build`, `pnpm start:services`) und Dev-Hilfen (`pnpm dev:services`). (siehe package.json Skripte)
- **CI-abhängige Python-Schicht**: Adapter-Builds und Tests erwarten `PYTHONPATH=src` sowie `requirements.txt` aus dem Repo-Root. (siehe package.json Abhängigkeiten)
- **Docker & Compose**: Das UI-Dockerfile erzeugt statische Artefakte; `docker-compose.yml` spannt Dev- und Test-Services sowie NewsBot/Climate-Mikrodienste auf. (siehe Dockerfile und docker-compose.yml)

## CI- und Testing-Lage

- **CI Core** prüft TypeScript (`npx tsc`), Vitest (`pnpm test:ts:ci`), Python (`pnpm test:py`) und Pyright – alles in einer OFFLINE/LOW_MEM-Umgebung. (siehe .github/workflows/ci.core.yml)
- **CI Extended** ergänzt Node 22 + Python 3.11 Läufe, inkludiert Offline-Adapter, STAC-Validierung und Resonanz-Smoke. (siehe .github/workflows/ci.extended.yml)
- **CI Experimental** lädt derzeit `pnpm agents:dry-run` und `pnpm guardrails:validate`, allerdings fehlen dafür Skripteinträge – die Jobs laufen deshalb nur als `|| true`-Fallback ohne echten Effekt. (siehe .github/workflows/ci.experimental.yml)
- **Policy Checks** splitten OPA, Kyverno und Guardrails in getrennte Jobs; Kyverno und Guardrails laufen mit `continue-on-error`, wodurch Fehler leicht übersehen werden. (siehe .github/workflows/policy-check.yml)

## Priorisierte Maßnahmen (Kurzfrist)

1. **Core-Builds grün halten**
   - Nightly Dry-Runs für `ci.core.yml` und `ci.extended.yml` automatisieren.
   - Stabilität dokumentieren (Badge oder Issue-Vorlage „Build Health“).
2. **CI Experimental reaktivieren**
   - `package.json` um `agents:dry-run` und `guardrails:validate` Skripte ergänzen (Nutzung vorhandener Tools unter `scripts/agents` und `tools/governance-guardrails.mjs`).
   - Sobald stabil, `|| true` entfernen und Ergebnisse im Policy-Report bündeln.
3. **Policy-Checks vereinheitlichen**
   - Gemeinsames Reporting (z. B. JSON/Markdown-Anhang im PR) für OPA, Kyverno und Guardrails.
   - Kyverno/Guardrails ohne `continue-on-error`, nachdem Flakes beseitigt sind.
4. **Linting & Formatting**
   - Husky/`lint-staged` sind aktiv; ergänze Richtlinien in CONTRIBUTING (z. B. keine Produktions-`ts-node`-Pfad, Services via `dist/`). (vgl. package.json lint-staged und CONTRIBUTING.md)
5. **Tests erweitern**
   - Unit-Tests für Agenten- und Policy-Hilfen (`scripts/agents`, `governance/**`).
   - `pnpm test:ts:extended` regelmäßig laufen lassen, um Offline-Pipelines frühzeitig zu prüfen.

## Build- & Release-Disziplin

- Dist-Artefakte als Grundlage für Produktion (`pnpm start:light`, `pnpm start:services`). (siehe package.json Startskripte)
- Docker Compose für Produktions-Simulation nutzen; Compose-Profile für „core only“ ergänzen, um Ressourcen zu sparen. (siehe docker-compose.yml)
- Prometheus/Grafana-Vorbereitungen liegen im Repo (`grafana/`, `observability/`); Metriken via `prom-client` bleiben Singletons (Fraktal30 Lessons).

## Dokumentation & Onboarding

- README/ONBOARDING auf Aktualität prüfen, Link auf diesen Plan setzen.
- `AI_POLICY.md` um konkrete Beispiele für Guardrail-Failures erweitern.
- `codexfeedback.*` als Fraktal-Tagebuch pflegen (Fraktal39 Lauf dokumentieren).

## Governance & Kommunikation

- Labels `run-extended` / `run-experimental` nur setzen, wenn entsprechende Pipelines stabil laufen.
- Nightly-Fehlschläge sollen Issues mit Logs erzeugen (Automation via `workflow_run` Hook vorbereiten).
- Issue-Labels `#build-health`, `#policy-check`, `#code-quality` zur Priorisierung verwenden.

## Nächste Meilensteine Richtung v1.0

| Fokus              | Zielzustand                                  | Messpunkt                                                     |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------- |
| Core Stability     | Alle Schritte in `ci.core.yml` grün          | `pnpm lint`, `pnpm test:ts:ci`, `pnpm test:py`, `npx pyright` |
| Extended Pipelines | Offline-Adapter + STAC Smoke stabil          | `pnpm adapter:build:*`, `pnpm stac:validate`                  |
| Policy Enforcement | Kombinierter Report ohne `continue-on-error` | Policy-Workflow Output                                        |
| Release Automation | Dist-Build + Docker Compose Pass             | `pnpm start:light`, `docker compose up`                       |
| Documentation      | README/ONBOARDING/AI_POLICY aktuell          | Review-Checklist                                              |

> „Stabilität zuerst – Wachstum folgt dem Atem der Builds.“
