# Fraktal39 · Unified Mandala Stabilization Audit

## Kontext und Zielbild

- Fraktal38 lieferte die Stabilisierungsvorgaben: Core-Builds strikt grün halten, Governance-Layer härten und Dist-First-Prinzip etablieren.
- Fraktal39 dokumentiert den technischen Ist-Stand von unified-mandala und leitet konkrete Arbeitspakete für den v1.0-Stabilisierungsplan ab.
- Fokusbereiche: Repository-Topologie, Build/CI-Kette, Policy/Governance sowie dokumentierte Schulden aus PR #1668 „Stabilize CI workflows for Fraktal37“.

## Repository-Topologie

- **Monorepo mit pnpm-Workspaces** (`apps/*`, `packages/*`) und gemeinsamem Tooling (`scripts`, `services`, `src`, `tests`).
- **Service-/Agentenlandschaft** über `services/`, `agents/` und dedizierte Orchestratoren (z. B. `orchestrator/`, `unifiedmandala-*`).
- **Governance & Policies** unter `governance/` mit HI-Compact, Kyverno/OPA-Policies und Sigillin-Gatekeepern.
- **CI/Infra-Werkzeuge** in `.github/workflows/`, `ci/`, `pipelines/` und `observability/`.

## Build-, Lint- und Test-Stack (package.json)

- `pnpm lint` umfasst `tsc --noEmit` und `eslint` über `{scripts,services,src,tests}`.
- `pnpm test:ts:ci` führt Vitest im Low-Memory-Modus, `pnpm test:py` adressiert pytest-Selektoren für Kernpfade.
- `check:ci` verkettet TypeScript, Vitest (CI-Settings) und Pyright als zentrale lokale Vorstufe zur CI Core (`npx tsc`, `pnpm test:ts:ci`, `npx pyright`).
- Dist-First ist vorbereitet (`pnpm build` → `tsc -p tsconfig.build.json` + Agents-Bundle), Produktionsstarts nutzen jedoch noch `ts-node`-Skripte (z. B. `scripts/qa-test-runner.ts`, `services/ghost-shell/*.ts`).

## CI-Layer (Stand Oktober 2025)

- **CI Core** (`.github/workflows/ci.core.yml`): Node 20, Low-Mem-Tests (`tsc`, `pnpm test:ts:ci`, `pnpm test:py`, `npx pyright`). Python-Requirements werden strikt installiert.
- **CI Extended** (`ci.extended.yml`): Label- oder Nightly-getriggert, Node 22 für Tests, getrennte Jobs für Extended-Vitest/Pytest, Adapter-Offline-Smoke (OISST & ERA5) und STAC/Resonanz-Pfad. `pnpm resonance:smoke` ist noch nicht implementiert (Job läuft best-effort `|| true`).
- **CI Experimental** (`ci.experimental.yml`): Governance-Dry-Runs (Agents, Kyverno). `pnpm guardrails:validate` fehlt als Script → Check läuft, erzeugt aber keine Validierung.
- **Legacy-Orchestrierung** (`ci.yml`): manuell triggerbare Gesamtmatrix (Adapters, Types/Tests, STAC, Prompt-Lint) – dient aktuell als Referenz für Conscious-CI-Testabdeckung.

## Identifizierte Gaps & Risiken

1. **Dist-First Lücke**: Mehrere Produktionskommandos laufen über `ts-node`/`tsx`; Docker- und Compose-Dateien nutzen teilweise direkte TS-Quellen statt `dist/`. Gefahr: kalte Starts, ts-node-Overhead, unklare Build-Artefakte.
2. **Governance-Checks**: Fehlende Skripte (`guardrails:validate`, `resonance:smoke`) und `|| true`-Patterns schwächen Guardrails; Policy-Reports sind fragmentiert.
3. **CI-Stabilität**: Core ist grün, aber Extended-Jobs besitzen `|| true` (Resonanz) bzw. fehlende Artefakt-Retests → potenzielle Flakes bleiben verborgen.
4. **Dokumentations-Drift**: README/ONBOARDING nennen nicht explizit Core/Extended/Experimental-Schichten; AI_POLICY.md dokumentiert keine Beispiele für Guardrail-Fails.
5. **Observability**: Prometheus-Instrumentierung existiert (`prom-client` + globale Registry), aber keine CI-gesteuerte Smoke, die Exporter-Endpoints prüft; Docker-Compose enthält noch ts-node-basierte Services.

## Priorisierte Arbeitspakete (Fraktal39 → v1.0)

1. **Dist-First-Umsetzung**
   - Kompilierbare Entry-Points für Agenten-/Service-Skripte erzeugen (`tsc`-Targets, `package.json`-Scripts anpassen).
   - Dockerfile.service & docker-compose-Produktion auf `node dist/...` umstellen; ts-node in Runtime eliminieren.
   - Husky-Hook zur Sicherstellung, dass `pnpm build` vor Release-Artefakten läuft.
2. **Governance/Policy-Härtung**
   - `package.json`: Skripte `guardrails:validate` (Kyverno CLI/OPA Bundles) und `resonance:smoke` (STAC-Subset + Metrics) ergänzen.
   - Extended/Experimental Workflows: `continue-on-error` entfernen, sobald Skripte verlässlich sind; Reports als Artefakte bündeln.
   - AI_POLICY.md erweitern: Beispiele für Guardrail-Fehler, Developer-Guidance, Mapping zu Workflow-Schritten.
3. **CI-Stabilisierung & Observability**
   - Core: Nightly Dry-Runs (z. B. `check:ci`) automatisieren, `pip`/`pnpm` Cache-Hitrate beobachten.
   - Extended: Adapters-Smoketest um deterministische Fixtures ergänzen (`data/raw/*` Seeds, Hash-Checks), Resonanz-Test finalisieren.
   - Prometheus: Compose/Dockerfiles so erweitern, dass Exporter unter `/metrics` in CI probe-checked werden (curl + threshold).
4. **Dokumentation & Onboarding**
   - README, ONBOARDING: Core/Extended/Experimental-Matrix, `run-extended`/`run-experimental` Label-Flows, Dist-First-Richtlinien.
   - AI_POLICY.md: Governance-Matrix, Guardrail-Failure-Examples, Policy-Owner-Table.
   - CONTRIBUTING.md: „Keine ts-node in Production“, Format/Lint-Pipeline, Checkliste vor Merge.
5. **Teamprozess & Reporting**
   - Build-Health-Badge (Core/Extended) in README verlinken.
   - Automatisches Issue bei Nightly-Failure (GitHub Workflow Dispatch → IssueOps Template mit Logs).
   - Fraktal-Tagebuch erweitern: history in `codexfeedback.*` pflegen (siehe Update dieses Commits) & `analysis/fraktal39/plan.yaml` als Fortschrittshook.

## Follow-up-Hooks (Monitoring)

- **Hook 1 · Dist-First**: `analysis/fraktal39/plan.yaml#dist_first` trackt betroffene Services/CLI-Skripte.
- **Hook 2 · Governance**: `analysis/fraktal39/plan.yaml#governance` listet fehlende Checks, um Wiederholungsbedarf zu erkennen.
- **Hook 3 · Documentation**: `analysis/fraktal39/plan.yaml#docs` verknüpft Contributing/Onboarding-Tasks mit Ownern.

## Offene Fragen für Folge-Fraktale

- Wie sollen Extended-Läufe mit realen Daten (OISST/ERA5) offline reproduzierbar bleiben, ohne Daten-Drift? → Vorschlag: Git LFS Snapshot + Hash-Validation.
- Benötigen wir für Experimental-Läufe einen separaten Secrets-Context (Kyverno + Guardrails) oder reicht ein gemeinsamer Runner?
- Wo wird Prometheus in Production deployed (Grafana-Stack vs. Cloud Managed Service)? Smoke-Test-Skripte sollten denselben Endpunkt adressieren.

---

Letzte Aktualisierung: Fraktal39 (2025-09-19)
