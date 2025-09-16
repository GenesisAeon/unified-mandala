# Fraktal38 – Unified Mandala Stabilisierungsaudit

## Kontext und Zielsetzung

Fraktal38 fokussiert auf die Vorbereitung des v1.0-Releasefensters von **unified-mandala**. Die Analyse bündelt Beobachtungen aus Repository-Struktur, Build-/Test-Infrastruktur sowie Governance-Layern, leitet kritische Risiken ab und formuliert Prioritäten für die nächsten Iterationen. Sie baut auf den Ergebnissen von Fraktal37 auf und dient als technische Entscheidungsgrundlage für den weiteren Fraktallauf.

## Repository-Architektur & Codeflächen

- **Monorepo mit PNPM-Workspaces**: `package.json` spannt `packages/*` und `apps/*` ein; zentrale Services liegen zusätzlich unter `scripts/`, `services/` und `src/`.【F:package.json†L1-L120】
- **Multi-Language-Stack**: TypeScript/Vitest (`vitest.config.ts`) für Agenten/Services, Python/Pytest (`pytest.ini`) für Datenadapter sowie Go-Module (`go-agent`, `go-bridge`).【F:vitest.config.ts†L1-L36】【F:pytest.ini†L1-L7】
- **UI-Build getrennt**: Der Produktions-Dockerfile kompiliert ausschließlich `packages/unifiedmandala-ui` und serviert das Resultat via NGINX; Backend-/Agentenlaufzeiten sind separat zu behandeln.【F:Dockerfile†L1-L11】

### Ableitungen

1. **Klare Layer-Trennung fortführen**: Core-Services in `src/` und `services/` brauchen Dist-Build-Artefakte analog zur UI, damit Production-Deployments ohne `ts-node` auskommen.
2. **Scripts konsolidieren**: Mehrfach vorhandene CLI-Aufrufe (`scripts/**/*.ts|mjs`) sollten in eine einheitliche CLI-Basis überführt werden, um den Wartungsaufwand zu reduzieren.
3. **Legacy-Bereiche markieren**: Experimente in `experiments/`, `demos/` und `simulations/` als optional kennzeichnen oder archivieren, sofern sie nicht mehr aktiv gepflegt werden.

## CI- & Test-Layering

### Core-Pipeline

- `ci.core.yml` läuft bei Push und PR, setzt Node 20 sowie Python 3.11, führt `tsc`, `pnpm test:ts:ci`, `pytest` und `pyright` unter OFFLINE/LOW_MEM-Umgebungen aus.【F:.github/workflows/ci.core.yml†L1-L37】
- Vitest-Konfiguration erzwingt Single-Thread-Execution, deaktiviert Coverage und blendet Extended/Experimental-Globs ohne entsprechende Flags aus.【F:vitest.config.ts†L14-L35】

### Extended-Suite

- `ci.extended.yml` wird über Label `run-extended` oder Nightly-Cron gestartet. Enthält TS- und Python-Extended-Tests, Adapter-Offlinesmokes sowie STAC-Validierung; `resonance:smoke` ist aktuell per `|| true` weichgestellt.【F:.github/workflows/ci.extended.yml†L1-L43】

### Experimental-Layer

- `ci.experimental.yml` hängt an Label `run-experimental`. Sowohl Agents-Dry-Run als auch Guardrails-Validierung laufen mit `|| true`, Ergebnisse werden als Artefakte hochgeladen.【F:.github/workflows/ci.experimental.yml†L1-L20】

### Governance-Checks

- Workflow `governance-check.yml` validiert Schemas und Governance-Skripte, lässt Fehler jedoch via `continue-on-error` passieren.【F:.github/workflows/governance-check.yml†L1-L20】
- `policy-check.yml` führt OPA, Kyverno und Guardrails aus; Kyverno und Guardrails sind ebenfalls tolerant konfiguriert.【F:.github/workflows/policy-check.yml†L1-L27】

### Handlungsempfehlungen

1. **Stabilität vor Feature-Wachstum**: Core-Pipeline muss dauerhaft grün bleiben, bevor weitere Funktionsausbauten erfolgen.
2. **`continue-on-error` abbauen**: Sobald Extended/Experimental Läufe reproduzierbar grün sind, Toleranzen entfernen (`resonance:smoke`, Guardrails, Kyverno, Governance-Checks).
3. **Dry-Runs automatisieren**: Agents-Dry-Run und Guardrails sollen spätestens Nightly voll durchlaufen; Fehler erzeugen Issues mit Log-Artefakten.
4. **Testschulden adressieren**: Kritische Agenten- und Policy-Pfade (z. B. `scripts/agents/runner.ts`, `tools/governance-guardrails.mjs`) benötigen gezielte Unit-Tests, um Regressionen frühzeitig zu erkennen.

## Build- und Release-Disziplin

- **Dist-First-Strategie**: Produktionsscripts nutzen teilweise noch `ts-node` (`scripts/agents/*.ts`, `scripts/export-depth-bundle.ts`). Für den Release-Train ist ein build step (`pnpm build`) mit anschließender Ausführung aus `dist/` erforderlich.【F:package.json†L52-L123】
- **Start-Skripte**: `start:light` nutzt `scripts/light-static-server.mjs` und erwartet ein vorab gebautes UI-Bundle – Grundlage für Smoke- und Offline-Tests.【F:package.json†L28-L39】【F:scripts/light-static-server.mjs†L1-L26】
- **Docker/Compose**: Neben dem UI-Dockerfile existieren Compose-Definitionen (`docker-compose.yml`, `.local`) für Mehrservice-Setups; müssen mit dist-Artifakten harmonieren.

### Maßnahmenplan

1. **Build-Pipelines vereinheitlichen**: `pnpm build` muss sämtliche produktionsrelevanten Services kompilieren; ergänzende Tasks in `scripts/dev-services.mjs` sollten dist-Verweise verwenden.
2. **Docker-Image-Hardening**: Server-Container (z. B. orchestrator) sollen keine Quellen enthalten, sondern nur `dist/` + minimalen Runner; Build-Prüfungen gehören in CI (`pnpm build` + `pnpm start:light`).
3. **Prometheus-Integration**: Prometheus-Exports (`prom-client`) sind vorhanden; Compose/Docker sollten die Ports standardisieren und ein Basisset an Alerts definieren.

## Governance & Policy-Ebene

- **Mehrere Policy-Layer**: OPA (`tools/opa-check.mjs`), Kyverno (`policies/kyverno.yaml`) und Guardrails (`tools/governance-guardrails.mjs`) existieren, liefern aber getrennte Reports und brechen Builds nicht.【F:.github/workflows/policy-check.yml†L1-L27】
- **PactDepth & Sigillin**: Guardrails greifen auf `pact-depth-rules.ts` und Sigil-Indices zurück; Konsolidierung der Reports reduziert die kognitive Last für Contributor.

### Empfehlungen

1. **Einheitlichen Policy-Report erzeugen**: OPA-, Kyverno- und Guardrails-Ergebnisse in einem Markdown/JSON-Report sammeln und als einzigen Artefakt-Link veröffentlichen.
2. **Fehlerbilder dokumentieren**: CONTRIBUTING/AI_POLICY sollen konkrete Beispiele enthalten, was ein Guardrails-Failure bedeutet und wie er lokal reproduziert wird.
3. **Frühwarnsystem**: Nightly-Fails sollen automatisiert Issues erzeugen (Label `#policy-check` / `#build-health`).

## Dokumentation & Onboarding

- README, CONTRIBUTING und AI_POLICY existieren, decken aber noch nicht die neue CI-Trennung (Core/Extended/Experimental) oder Dist-First-Regeln ab.
- Es fehlen detaillierte Beispiele für Governance-Workflows (z. B. Guardrails-Reproduktion, Kyverno-Dry-Run).

### Tasks

1. **README/ONBOARDING aktualisieren**: Neue Pipeline-Struktur, Label-Trigger und Offline-Anforderungen dokumentieren.
2. **AI_POLICY um Praxisbeispiele ergänzen**: Guardrails-Failures, Sigillin-Governance, CREP-Checks.
3. **Build-Health-Kommunikation**: Badge oder Dashboard aufsetzen, das `ci.core`, `ci.extended` und `ci.experimental` Status zeigt.
4. **Nightly-Auto-Issues**: Workflow ergänzen, der bei Fehlschlägen Logs extrahiert und ein Issue mit Kontext erstellt.

## Teamprozesse & Tracking

- Fraktal-IDs sind etabliert (`fraktal-zyklus.md`, `codexfeedback.*`).
- Labels wie `run-extended` / `run-experimental` existieren; zusätzliche Labels (`#build-health`, `#policy-check`) helfen bei Priorisierung.
- Backlog-Struktur (Kanban/Jira) sollte die Roadmap „Stabilität → Wachstum“ widerspiegeln.

## Roadmap Snapshot (Fraktal38 → v1.0)

| Phase                   | Fokus             | Kernaufgaben                                                                                                         |
| ----------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Sofort**              | Core-Stabilität   | Core-Workflows grün halten, continue-on-error entfernen sobald möglich, Guardrails/Kyverno/Resonance dry-runs härten |
| **Kurzfristig**         | Codequalität      | ESLint/Prettier-Hooks enforced lassen, Dead Code entfernen, Scripts zu CLI bündeln                                   |
| **Kurzfristig**         | Tests             | Kritische Agent- & Policy-Unit-Tests, Extended/Experimental automatisieren                                           |
| **Kurz-/Mittelfristig** | Release           | Dist-Builds für alle Services, Docker/Compose mit Build-Prüfungen, Prometheus im Deployment                          |
| **Mittelfristig**       | Doku & Governance | README/ONBOARDING/AI_POLICY aktualisieren, Policy-Reports konsolidieren, Nightly-Issue-Automation                    |
| **Langfristig**         | Strategie         | Roadmap v1.x (Performance, UI-Integration Sigils) & v2.0 (Sigil-UI, emergente Features) ausarbeiten                  |

## Offene Risiken & Nächste Schritte

1. **Flaky Extended/Experimental-Läufe** (Kyverno & Resonance Smoke) – Reproduzierbarkeit sicherstellen, Logs sammeln, tolerierte Fehler abschalten.
2. **Dist-First-Lücke bei Services** – Build-Artefakt-Pipeline definieren, `ts-node` im Produktionspfad eliminieren.
3. **Policy-Überlagerungen** – Standardisierte Reports + Dokumentation verhindern Doppelarbeit.
4. **Monitoring** – Prometheus/Grafana bereits vorhanden (`observability/`, `grafana/`), aber CI-Integration fehlt.

## Übergabe an Fraktal39

- Diese Analyse bildet die technische Basis für Fraktal39. Nächster Schritt ist die Umsetzung der priorisierten Maßnahmen (CI-Härtung, Dist-Builds, Dokumentationsupdates) und die fortlaufende Aktualisierung von `codexfeedback.*`.
