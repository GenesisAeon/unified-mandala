# Fraktal38 – Unified Mandala Deep Dive

## Architekturüberblick

- **Monorepo-Aufteilung**: `packages/*` für SDK/Utilities, `services/*` für Laufzeitdienste, `apps/*` für UI. Skripte und Governance-Werkzeuge liegen unter `scripts/` bzw. `tools/`.
- **Build-Pipeline**: `pnpm build` erzeugt dist-first Artefakte über `tsconfig.build.json`. Neue `policy:build`-Stufe kompiliert Governance-Hilfen gezielt.
- **Agenten-Ökosystem**: `agents.yaml` und begleitende Tools orchestrieren Rollen (Planner, Narrator, Implementer). `scripts/dev-services.mjs` bündelt Services lokal/produktiv.
- **Governance-Schicht**: Policies (`policies/*.yaml`, `tools/opa-check.mjs`, Guardrails) regeln Ethik und Merge-Kontrollen. Der neue Policy-Suite-Lauf fasst OPA, Kyverno und Guardrails zusammen.

## CI- und Governance-Disziplin

- **Core/Extended/Experimental**: Tests sind über `ci.core.yml`, `ci.extended.yml`, `ci.experimental.yml` getrennt. `check:ci` führt TSC, Vitest (CI-Profil) und Pyright aus.
- **Policy Suite**: `.github/workflows/policy-check.yml` ruft `pnpm policy:check` auf und erzeugt `out/policy-report.json`. Ergebnis enthält zusammengefasste Status (pass/fail/skipped) und Detailmeldungen.
- **Guardrails**: `tools/governance-guardrails.mjs` akzeptiert `POLICY_GIT_BASE` / `POLICY_GIT_RANGE` und fällt bei Shallow-Clones auf `HEAD^ HEAD` oder `HEAD` zurück.
- **Kyverno-Dry-Run**: `src/governance/policy-evaluator.ts` interpretiert Kyverno-Patterns (`(topic)`, `(personhood)` etc.), prüft Fixtures und liefert Violation-Details für Reports und Tests.

## Tests & Qualität

- **Neue Unit-Tests**: `tests/governance/policy-evaluator.test.ts` deckt Normalisierung, Ressourcenmaterialisierung, Policy-Matching und Fehlerszenarien ab.
- **Kyverno/Ethik-Abdeckung**: `evaluateFromFiles` validiert `policies/kyverno.yaml` gegen `fixtures/events/example_input.json`. Fehlende Personhood-Level werden als Violations gemeldet.
- **Policy-Report-Artefakt**: JSON-Report ermöglicht UI/Badge-Integration und erleichtert Nightly-Audits.

## Analyse der letzten PR-Testfehler (Fraktal37 → #1668)

- **Policy Checks**: Kyverno-Action lieferte Dry-Run-Warnungen ohne Zusammenfassung; Guardrails liefen im `continue-on-error`-Modus. Die neue Suite meldet Verstöße gesammelt und beendet den Job bei Fehlschlägen.
- **Repo-Sanity**: Fehlender `analysis/ui-vr-audit.json` erzeugte zuvor harte Fehler. Heute als Warning gehandhabt (siehe Repo-Sanity-Workflow) – weiter beobachten.
- **NumPy Warnung**: Pytest-Lauf vermerkt potenziell inkompatibles Binary. Empfehlung: Wheel-Version pinnen oder Rebuild triggern.
- **NPM Noise**: Warnungen zu unbekannten Env-Variablen (`http-proxy`, `_jsr-registry`, `verify-deps-before-run`). Cleanup empfohlen, um Logs zu beruhigen.

## Nächste Schritte

1. **Prometheus Production**: Dashboard `grafana/` enthält Grundgerüst. Prometheus-Targets in Docker Compose/Dockerfile.service verdrahten.
2. **Policy-Erweiterung**: Weitere Kyverno-Regeln (z. B. Safety-Fenster, CREP-Level) modellieren, Tests erweitern.
3. **Build Health Badge**: Policy-Report kann via GitHub Pages oder Shields.io für Build-Status genutzt werden.
4. **Nightly Automation**: Policy-Suite in Extended/Nightly-Läufe aufnehmen, Issue-Automatisierung für Violations.

— Fraktal38 Audit abgeschlossen.
