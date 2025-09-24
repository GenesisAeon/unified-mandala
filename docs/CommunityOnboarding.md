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
   > **Hinweis:** `corepack enable` benötigt Administratorrechte. Falls du ohne erhöhte Rechte arbeitest, erledigt `scripts/setup-dev-env.ps1` die Benutzeraktivierung automatisch über `corepack prepare pnpm@10.17.0 --activate` und überspringt das persistente Enable.
   > Für `pnpm start:all` wird ein laufender `nats-server` erwartet; installiere ihn bei Bedarf via `winget install --id Synadia.NATS-Server -e` oder starte `docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js`. Bestehende Docker-Container prüfst du mit `docker ps -a --filter name=^/nats$ --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"` und aktivierst sie bei Bedarf mit `docker start nats`; `scripts/setup-dev-env.ps1` meldet laufende Container als erfüllt und erinnert bei `Exited`-Status an diese Befehle (PowerShell-Portcheck: `Test-NetConnection 127.0.0.1 -Port 4222`).
2. Überblick über wichtige CLI-Befehle verschaffen:
   ```bash
   ./scripts/aeon.sh help         # zeigt alle poetischen und technischen Befehle
   ./scripts/aeon.sh onboarding   # präsentiert den Onboarding-Ritus
   ./scripts/aeon.sh cycle_start  # startet einen lokalen Mandala-Zyklus
   pnpm test                      # führt Unit- und UI-Tests aus
   pnpm docs:auto                 # generiert TypeDoc-API-Dokumentation
   pnpm policy:check              # OPA + Guardrails + Kyverno
   pnpm test:unit:coverage        # Coverage-Report (Vitest)
   docker compose --profile monitoring up   # Prometheus + Grafana Profil
   ```

Weitere Hinweise zu Modulen und Ordnerstruktur findest du im [Handbuch](Handbuch.md).

## Onboarding Demo

Eine kurze Schritt-für-Schritt-Anleitung zum Starten einer Demo inklusive Mistral Code Agent findest du in [docs/demo/onboarding-demo.md](demo/onboarding-demo.md).

## Custom Connectors (MCP) – Schnellreferenz

Für Mandala-Integrationen mit ChatGPT Custom Connectors (MCP) gelten einige Voraussetzungen außerhalb des Repos:

1. **Plan prüfen** – Custom Connectoren stehen nur für ChatGPT **Pro** oder **Business/Enterprise/Edu** Workspaces bereit. Free/Plus Accounts zeigen den Schalter nicht.
2. **Rolle verifizieren** – In Workspaces können ausschließlich **Owner/Admins** neue Connectoren aktivieren. Normale Mitglieder sehen die Option erst, nachdem ein Admin sie freigeschaltet hat.
3. **Einstellungen finden** – In ChatGPT: `Settings → Connectors` → "Add custom connector". Die UI verlinkt direkt auf die MCP-Dokumentation.
4. **Rollout-Status beachten** – Manche Funktionen (z. B. Deep Research) werden stufenweise pro Region ausgerollt. Fehlt der Schalter trotz erfüllter Voraussetzungen, ist der Account vermutlich noch nicht freigeschaltet.
5. **MCP-Server bereitstellen** – Sobald die Option sichtbar ist, erwartet ChatGPT einen erreichbaren MCP-Server (lokal oder remote). Technische Anforderungen und Sicherheitsrisiken stehen in der offiziellen Dokumentation: <https://platform.openai.com/docs/mcp>.

> Tipp: Teste die Einstellungen sowohl im Web (chat.openai.com) als auch in der Desktop-App. Melde dich ggf. einmal ab/an, falls der Toggle nicht sofort erscheint.

## AI Governance Primer

- **Policy Suite** (`pnpm policy:check`) vereint OPA, Guardrails und Kyverno.
  - Typische Meldung _"sensitive-data"_ → sensitives Material entfernen oder verschlüsseln.
  - _"policy-doc-missing"_ → Doku in `docs/governance/` bzw. `AI_POLICY.md` ergänzen.
- **Merge-Gates**: Pull-Requests schlagen fehl, wenn Governance-Checks nicht grün sind.
- **Metrics-Verpflichtung**: Services sollen `/metrics` via `@um/health` anbieten; Monitoring-Profil (`docker compose --profile monitoring up`) prüft Prometheus/Grafana lokal – `pnpm observability:check` validiert Prometheus `/api/v1/targets` und Grafana `/api/health` (Port 3300).
- Weitere Details liefert `docs/governance/policy-suite.md` und `AI_POLICY.yaml`.
