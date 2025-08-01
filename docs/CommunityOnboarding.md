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
