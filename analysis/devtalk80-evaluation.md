# DevTalk80 Evaluation – Responses Bridge Recovery

## Kontext

- Quelle: `DevTalk.txt`, Abschnitt zu CI/CD-Stabilisierung, AI-Governance und dem Gemini-Sigillin-Briefing.
- Fokus dieses Fraktal-Laufs: Fehlermeldung `400 Invalid value: 'text'` beim Aufruf von `/api/ai/chat` (OpenAI Responses API) beseitigen und den Fix in Stabilization-Playbook & MandalaMap spiegeln.

## Sofortmaßnahmen (umgesetzt)

1. **Responses Payload anpassen**
   - `packages/ai/src/ask.ts` mappt Chat-Verläufe jetzt auf `input_text`/`output_text` Parts, entfernt das Legacy-`type: "text"` und sendet optionale Felder (`temperature`, `max_output_tokens`) nur, wenn gesetzt.
   - Vitest-Unit-Test (`packages/ai/test/ask.test.ts`) belegt die Payload-Form und Usage-Extraktion.
2. **API-Brücke absichern**
   - `apps/api/src/index.ts` profitiert direkt vom neuen Wrapper – UI-Smoke `/demo/ai-playground` liefert wieder Antworten, sobald `OPENAI_API_KEY` gesetzt ist.
3. **Dokumentationsabgleich**
   - Stabilization-Playbook (`docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`) und MandalaMap (`MandalaMap.(md|json|yaml)`) nennen den Fix explizit, inklusive Verweis auf die vorherige 400er-Fehlerquelle.
4. **Fraktal-Tracking**
   - `codexfeedback*` ergänzt Fraktal83-Logeintrag inkl. Hook (Follow-up: UI-Smoke mit Live-Key automatisieren und Mock-Fallback dokumentieren).

## Folgeaufgaben (aus DevTalk priorisiert)

- **CI/Test-Bündel**: DevTalk bestätigt Bedarf an erweiterten Smoke-Tests (Docker/E2E). Aktuell relevant: Playground-Call in Smoke-Suite integrieren, sobald Secret-Handling steht.
- **AI-Governance**: Gemini-Sigillin-Duo (JSON+Markdown) als separate Aufgabe aufnehmen; noch nicht implementiert.
- **Observability**: Bereits in früheren Fraktalen umgesetzt, aber DevTalk empfiehlt weitere Alerts → prüfen, ob `/api/ai/chat` Fehlerquoten ins Monitoring einfliessen können.

## Empfehlung

- Kurzfristig UI-Smoke oder Contract-Test für `/api/ai/chat` vorbereiten (Mock-Key oder lokaler Stub), damit das Regressionen abfängt.
- Mittel-/Langfristig DevTalk-Roadmap Schritt für Schritt prüfen (CI-Abzeichen, Policy-Badges, Gemini-Sigillin). Fraktal-Hooks aktualisieren, sobald entsprechende Läufe starten.

## Status

- **Fraktal83**: _done_ – Responses-Bridge wieder funktionsfähig, Dokumentation synchronisiert.
- **Wiederholung nötig?** Nein.
