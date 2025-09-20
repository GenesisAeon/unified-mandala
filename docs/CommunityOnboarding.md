# Community Onboarding Guide

Dieses Dokument erleichtert neuen Mitwirkenden den Einstieg in UnifiedMandala.

## Schnellstart

1. Repository klonen und Abhängigkeiten installieren:
   ```bash
   git clone https://github.com/GenesisAeon/unified-mandala.git
   cd unified-mandala
   ./scripts/setup-dev-env.sh            # optional: Linux/macOS Setup
   pwsh -NoProfile -File ./scripts/setup-dev-env.ps1  # optional: Windows Setup (PowerShell 7+)
   # fallback: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-dev-env.ps1
   corepack enable && corepack prepare pnpm@10.17.0 --activate
   pnpm install --frozen-lockfile
   pnpm build
   pnpm dev
   ```
2. Überblick über wichtige CLI-Befehle verschaffen:
   ```bash
   ./scripts/aeon.sh help         # zeigt alle poetischen und technischen Befehle
   ./scripts/aeon.sh onboarding   # präsentiert den Onboarding-Ritus
   ./scripts/aeon.sh cycle_start  # startet einen lokalen Mandala-Zyklus
   pnpm test                      # führt Unit- und UI-Tests aus
   pnpm docs:auto                 # generiert TypeDoc-API-Dokumentation
   pnpm policy:check              # OPA + Guardrails + Kyverno
   pnpm test:unit                 # Coverage-Report (Vitest)
   docker compose --profile monitoring up   # Prometheus + Grafana Profil
   ```

Weitere Hinweise zu Modulen und Ordnerstruktur findest du im [Handbuch](Handbuch.md).

## Onboarding Demo

Eine kurze Schritt-für-Schritt-Anleitung zum Starten einer Demo inklusive Mistral Code Agent findest du in [docs/demo/onboarding-demo.md](demo/onboarding-demo.md).

## AI Governance Primer

- **Policy Suite** (`pnpm policy:check`) vereint OPA, Guardrails und Kyverno.
  - Typische Meldung _"sensitive-data"_ → sensitives Material entfernen oder verschlüsseln.
  - _"policy-doc-missing"_ → Doku in `docs/governance/` bzw. `AI_POLICY.md` ergänzen.
- **Merge-Gates**: Pull-Requests schlagen fehl, wenn Governance-Checks nicht grün sind.
- **Metrics-Verpflichtung**: Services sollen `/metrics` via `@um/health` anbieten; Monitoring-Profil (`docker compose --profile monitoring up`) prüft Prometheus/Grafana lokal.
- Weitere Details liefert `docs/governance/policy-suite.md` und `AI_POLICY.yaml`.
