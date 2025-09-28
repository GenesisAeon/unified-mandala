# DevTalk84 Evaluation – PNPM Shortcuts Recovery

## Kontext

- Quelle: `DevTalk.txt` beschreibt den v1.0-Stabilisierungsplan (CI-Gates, Policy-Suite, Smoke-Tests, Dokumentation) sowie das Gemini-Sigillin-Briefing.【F:DevTalk.txt†L1-L160】
- Rückmeldung: Mehrere `pnpm`-Kommandos und PowerShell-Shortcuts laufen lokal nicht zuverlässig. Ziel dieses Laufs ist eine Bestandsaufnahme samt Follow-up-Hooks.

## Erfüllte DevTalk-Bausteine

- **CI- und Policy-Gates** – `package.json` bündelt weiterhin Typecheck, Tests, Schema-/Map-Validierung und Policy-Suite in `check:ci` und `check:precommit`; Coverage (`test:unit:coverage`) ist Bestandteil der Core-Pipeline.【F:package.json†L72-L179】
- **Dist-First/Setup-Doku** – `docs/DEV-SHORTCUTS.md` dokumentiert die Dev-Helper-Workflows (`Start-UM`, `Smoke-UI`, `pnpm dev:health`) und verweist auf Port-Cleanup sowie Maps-Sync.【F:docs/DEV-SHORTCUTS.md†L1-L85】
- **Gemini-Sigillin** – Sigillin-Assets (`sigils/google-gemini-briefing.sigil.json`, `docs/sigillin/GOOGLEGEMINI_SIGILLIN.md`) liegen bereits vor; keine neuen Inhalte erforderlich.【F:DevTalk.txt†L137-L160】

## PNPM- & Shortcut-Audit

### Kern-Starter & Stacks

- `pnpm dev:stack`, `pnpm start:all`, `pnpm live:*` und `pnpm start:services` nutzen `scripts/dev-services.mjs`, inklusive Preflight-Build für `@unified-mandala/ai` und Port-Checks.【F:package.json†L34-L50】【F:scripts/dev-services.mjs†L31-L195】
- `pnpm start:cosmic-web` orchestriert NATS, Artefakt-Build, Dev-Services und UI-Smoke; `pnpm demo:cosmic:*` liefert manuelle Einzelschritte.【F:package.json†L35-L42】【F:scripts/start-cosmic-web.mjs†L1-L160】

### PowerShell-Shortcuts (Windows)

- `pnpm ps:*` Kommandos kapseln `scripts/dev-helper.ps1` (Start/Stop/Test/Smoke). Die Doku nennt `Start-UM`, `Smoke-AI`, `pnpm dev:health` und Port-Aufräumskripte.【F:package.json†L60-L71】【F:docs/DEV-SHORTCUTS.md†L1-L85】
- Aktuell existiert kein automatisierter Health-Check für die `ps:*`-Befehle; sie sind nur in manuellen Playbooks beschrieben.

### Diagnostik & Observability

- `pnpm dev:health` startet den Health-Aggregator (`scripts/health-aggregator.ts`), `pnpm smoke:live` ruft Health + Chat-Szenario ab.【F:package.json†L57-L59】
- `scripts/dev-services.mjs` erkennt fehlende Dist-Artefakte, optional setzt es `DISABLE_NATS` falls JetStream nicht erreichbar ist.【F:scripts/dev-services.mjs†L31-L148】

## Gaps & offene Aufgaben

1. **Shortcut-Parität prüfen** – Es fehlt ein automatisierter Testlauf, der `pnpm dev:stack`, `pnpm start:cosmic-web`, `pnpm smoke:live` und repräsentative `ps:*`-Kommandos (Start/Stop) in einer CI- oder lokalen Diagnose bündelt. Aktuell lassen sich Fehlkonfigurationen (z. B. fehlendes Docker/NATS, falsche Port-Offsets) nur manuell erkennen.【F:package.json†L34-L71】【F:scripts/start-cosmic-web.mjs†L1-L160】
2. **Fehler-Reporting für PowerShell-Helper** – `pnpm ps:*` propagiert Exit-Codes, aber ohne einheitliches Logging/Retry-Konzept. Ein Script sollte orchestriert prüfen, ob PowerShell verfügbar ist und bei Fehlern Hinweise (Corepack, ExecutionPolicy) liefert.【F:package.json†L60-L71】
3. **Dokumentierte Recovery-Pfade** – Die Dev-Doku beschreibt zwar Befehle, aber keine Troubleshooting-Tabelle für häufige Ausfälle (Docker nicht gestartet, `pnpm exec tsx` fehlt, Node-Version falsch).【F:docs/DEV-SHORTCUTS.md†L18-L85】

## Empfehlungen / Follow-ups

1. **`pnpm diag:shortcuts`** – neues Skript, das lokal `pnpm dev:stack --dry-run`, `pnpm smoke:live --dry-run` (oder Mock-Targets) und PowerShell-Hooks (via `pwsh -Command Test-UM`) sequentiell prüft und Exit-Codes sammelt. Ergebnis: JSON-Report für Devs + optionaler CI-Job.【F:package.json†L34-L71】
2. **Health-Docs erweitern** – Abschnitt in `docs/DEV-SHORTCUTS.md` ergänzen: „Wenn `pnpm ps:start-um` fehlschlägt → check Docker Desktop / `pnpm nats:doctor` / ExecutionPolicy“.【F:docs/DEV-SHORTCUTS.md†L18-L85】
3. **MandalaMap/Playbook-Hook** – MandalaMap & Stabilization-Playbook erhalten einen neuen Follow-up-Eintrag „Shortcut-Parität automatisieren“, damit zukünftige Fraktale den Health-Check implementieren.【F:MandalaMap.yaml†L228-L276】【F:docs/roadmap/v1.0-stabilization-playbook.yaml†L160-L202】

## Status

- **Fraktal85**: _done_ – Audit dokumentiert, Follow-ups für Shortcut-Diagnostik gesetzt.
- **Wiederholung nötig?** Nein; nächste Läufe implementieren die vorgeschlagenen Diagnostikskripte.
