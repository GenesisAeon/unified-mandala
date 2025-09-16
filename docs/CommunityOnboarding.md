# Community Onboarding Guide

Dieses Dokument erleichtert neuen Mitwirkenden den Einstieg in UnifiedMandala.

## Schnellstart

1. Repository klonen und Abhängigkeiten installieren:
   ```bash
   git clone https://github.com/GenesisAeon/unified-mandala.git
   cd unified-mandala
   ./scripts/setup-unifiedmandala.sh
   pnpm dev
   ```
2. Überblick über wichtige CLI-Befehle verschaffen:
   ```bash
   ./scripts/aeon.sh help         # zeigt alle poetischen und technischen Befehle
   ./scripts/aeon.sh onboarding   # präsentiert den Onboarding-Ritus
   ./scripts/aeon.sh cycle_start  # startet einen lokalen Mandala-Zyklus
   pnpm test                      # führt Unit- und UI-Tests aus
   pnpm docs:auto                 # generiert TypeDoc-API-Dokumentation
   ```

Weitere Hinweise zu Modulen und Ordnerstruktur findest du im [Handbuch](Handbuch.md).

## Onboarding Demo

Eine kurze Schritt-für-Schritt-Anleitung zum Starten einer Demo inklusive Mistral Code Agent findest du in [docs/demo/onboarding-demo.md](demo/onboarding-demo.md).

## AI Governance Primer

- **Policy-Gates ausführen:**
  ```bash
  pnpm policy:check
  ```
  Der Lauf erzeugt `out/policy/policy-suite-report.md` und stoppt bei Guardrail-Verletzungen.
- **Typische Guardrail-Fehler & Lösungen:**
  | Meldung | Maßnahme |
  | --- | --- |
  | `Sensitive data detected` | Daten anonymisieren oder verschlüsseln, anschließend Commit aktualisieren |
  | `Policy docs missing` | Relevanten Abschnitt in `AI_POLICY.md` oder `docs/governance/policy-suite.md` ergänzen |
  | `Untracked policy change` | Sicherstellen, dass Policy-Änderungen + Dokumentation im selben PR landen |
- **Weiterlesen:** `AI_POLICY.md`, `AI_POLICY.yaml` und `docs/governance/policy-suite.md` enthalten Allow/Deny-Beispiele sowie den vollständigen Guardrail-Katalog.
