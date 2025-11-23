# DevTalk95 Evaluation – Sigil Runtime Guard & Membrane UI

## Kontext

- **Quelle**: `DevTalk.txt` – Fokus auf Runtime-Gate, Observability-Hooks, UI-Membrane-Pill und RAG-Indizierung.
- **Ziel**: Nachhalten, welche Follow-ups aus Fraktal94 umgesetzt wurden (Runtime/Publisher/UI) und welche Restarbeiten offen bleiben.
- **Artefakte geprüft**: `src/runtime/sigil/*`, `src/kpi/membrane-bridge.ts`, `src/membrane/state.ts`, `scripts/dev/api-ops.ts`, `apps/ui/src/components/*`, `tests/sigil/*`, `tests/kpi/membrane-bridge.test.ts`, `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`, `MandalaMap.*`.

## Umsetzungsstand gegenüber DevTalk-Zielen

| Bereich              | DevTalk-Anforderung                                                | Status Fraktal95                                                                                    | Hinweise & Folgeaktionen                   |
| -------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Runtime-Gate         | SigilMessage vor Publish strikt validieren, ASCII-Fallback liefern | ✅ `src/runtime/sigil/validator.ts` (Ajv 2020) + `compat.ts` (`toAsciiSafe`) sichern Publisher.     | Weitere Bridges auf neuen Guard migrieren. |
| Telemetrie & Logging | Prometheus Counter, JSON Logline, RAG Snapshot                     | ✅ `sigil_emitted_total`, JSONL Writer `data/logs/sigils/events.jsonl`, UI OpsPanel zeigt Pill.     | RAG-Auto-Index trigger noch dokumentieren. |
| Membrane UI          | Pill im OpsPanel mit Schema-Version / ASCII-Anzeige                | ✅ `MembranePill` erweitert (Glyph + Tooltip), `OpsPanel` bindet Snapshot aus API ein.              | Tooltip/Copy-Button optional prüfen.       |
| Dev Mock & Snapshots | KPI-Mock soll Membrane-Fortschritt spiegeln                        | ✅ `scripts/dev/api-kpi.ts` ruft `stepOrBypass`, `scripts/dev/api-ops.ts` liefert Snapshot JSON.    | Boundary-Smoke um dedupe erweitern.        |
| Tests & Matrix       | Contract-Matrix, Negativ-Cases, Publisher-Tests                    | ✅ Matrix & invalid URIs (`tests/sigil/schema.contract.test.ts`), Publisher/Boundary Tests ergänzt. | Coverage im CI-Lauf sicherstellen.         |
| Roadmap / MandalaMap | Statusnotiz + Meta aktualisieren                                   | ✅ Roadmap & MandalaMap auf Fraktal95 gehoben (Observability-Status, Runtime-Gate erwähnt).         | Weiterhin auf Folge-Hooks achten.          |

## Neue Deliverables in Fraktal95

- `src/runtime/sigil/validator.ts`, `compat.ts`, `metrics.ts`, `publisher.ts` – Runtime-Gate, ASCII Helper, Prom Counter, JSONL Snapshot.
- `src/membrane/state.ts` – Snapshot-Registry für OpsPanel & Tests.
- `src/kpi/membrane-bridge.ts` – SigilMessage Publish auf Statewechsel (UUID, Kontext, Meta) + Snapshot-Updates.
- `scripts/dev/api-ops.ts`, `scripts/dev/api-kpi.ts` – OpsPanel API liefert Membrane-Payload, KPI-Mock speist Membrane.
- `apps/ui/src/components/MembranePill.tsx`, `apps/ui/src/components/OpsPanel.tsx` – UI Pill + Integration.
- `tests/sigil/schema.contract.test.ts`, `tests/sigil/publisher.test.ts`, `tests/kpi/membrane-bridge.test.ts` – Matrix/Publisher/Snapshot Coverage.
- `docs/membrane/real-membrane-v0.1.md`, `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`, `MandalaMap.*` – Dokumentation & Meta aktualisiert.

## Offene Punkte

1. **Boundary Smoke Dedupe** – Tests (`pnpm smoke:boundary`) um Event-Key/Dedupe ergänzen, sobald Hook final.
2. **Publisher-Handbuch** – Kurze README/Runbook-Notiz, wie weitere Bridges `publishSigilMessage` einhängen.
3. **RAG Automatisierung** – Optionaler Trigger (CLI/API) für `data://logs/sigils/` Index dokumentieren.

## Update 2025-12-05

- Boundary-Smoke (`scripts/smoke/boundary-smoke.mjs`) prüft jetzt `eventKey`-Pflicht & Dedupe, `tests/smoke/boundary-smoke.spec.ts` deckt Missing/Duplicate-Pfade ab.
- Runbook `docs/runbooks/sigil-publisher.md` beschreibt Logger/Bus/Boundary-Integration sowie Snapshot-Erwartungen.
- Roadmap & MandalaMap referenzieren das Update; verbleibender optionale Hook: RAG-Auto-Index/weitere Bridge-Migrationen dokumentieren.

## Empfohlene Befehle

- `pnpm vitest run tests/sigil/schema.contract.test.ts tests/sigil/publisher.test.ts tests/kpi/membrane-bridge.test.ts`

## Status

- Fraktal95 erfüllt den Runtime-/UI-Fokus des DevTalk; Wiederholung nur bei offenen Boundary-Smokes oder fehlendem Publisher-Runbook nötig.
