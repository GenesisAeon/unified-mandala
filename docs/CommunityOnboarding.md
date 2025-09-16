# Community Onboarding Guide

Dieses Dokument erleichtert neuen Mitwirkenden den Einstieg in UnifiedMandala.

## Schnellstart

1. Repository klonen und Grundsetup durchführen:
   ```bash
   git clone https://github.com/GenesisAeon/unified-mandala.git
   cd unified-mandala
   ./scripts/setup-dev-env.sh     # richtet Node/Python/pnpm ein
   pnpm build                     # erzeugt dist/ Artefakte (Dist-First)
   pnpm start:light               # Smoke-Test der gebauten UI (http://127.0.0.1:3000)
   pnpm policy:check              # Governance-Gates (OPA, Guardrails, Kyverno)
   pnpm test:ts:ci
   pnpm test:py
   npx pyright
   ```
2. Monitoring-Stack optional starten:
   ```bash
   docker compose --profile monitoring up -d
   # Prometheus: http://localhost:9090, Grafana: http://localhost:3001
   ```
3. Hot-Reload oder Service-Orchestrierung aktivieren:
   ```bash
   pnpm dev:ui                    # Vite Dev Server mit HMR
   pnpm dev:services              # Agenten- und Service-Orchestrierung im Dev-Modus
   pnpm start:services            # Prod-Vorschau aus dist/ Artefakten
   ```

Weitere Hinweise zu Modulen und Ordnerstruktur findest du im [Handbuch](Handbuch.md).

## AI Governance Primer

- **Policy Suite lokal ausführen:** `pnpm policy:check` schreibt die Ergebnisse nach `out/policy/` und verhält sich identisch zur CI.
- **Ergebnismatrix:**

  | Signal                                        | Bedeutung                                                                           | Sofortmaßnahme                                                                                                  |
  | --------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
  | `[Guardrail] Policy change without docs`      | Policy-Dateien (z. B. `policies/…`) wurden geändert, ohne passende Doku anzupassen. | Im selben PR relevante Dokumentation (z. B. `AI_POLICY.md`, `docs/governance/policy-suite.md`) aktualisieren.   |
  | `[Guardrail] Gate widening without issue ref` | Eine Zugangsgrenze (Personhood-Level) wurde erweitert, ohne Issue-Verweis.          | Commit-Message oder PR-Beschreibung mit `#<IssueNr>` ergänzen oder Änderung rückgängig machen.                  |
  | `[Guardrail] Missing API keys (.env not set)` | Für LLM-Tools fehlen API-Schlüssel in `.env`.                                       | `.env` mit `ANTHROPIC_API_KEY`/`MISTRAL_API_KEY` befüllen oder Guardrail-relevante Dateien unangetastet lassen. |
  | `OPA allow=false`                             | Das Governance-Fixture erfüllt die Rego-Regeln nicht.                               | `fixtures/events/example_input.json` oder `policies/governance.rego` prüfen und anpassen; Compliance begründen. |
  | `Kyverno denied`                              | Kubernetes-Policy verletzt (z. B. fehlende Labels).                                 | Ressource/Fixture ergänzen (Labels, Limits, Owner) oder Policy aktualisieren.                                   |

- **Dokumentation:** Ausführliche Hinweise siehe `AI_POLICY.md` und `docs/governance/policy-suite.md`. Änderungen an Policies müssen dokumentiert und im Codex-Feedback protokolliert werden.

## Onboarding Demo

Eine kurze Schritt-für-Schritt-Anleitung zum Starten einer Demo inklusive Mistral Code Agent findest du in [docs/demo/onboarding-demo.md](demo/onboarding-demo.md).
