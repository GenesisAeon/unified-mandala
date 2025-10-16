# Codexfeedback – Fraktal 98

- Phase: Boundary Idempotency & Ops badges
- Status: Boundary-Service exportiert neue `/metrics`-Zähler (`boundary_observe_total`, `boundary_idempotency_missing_total`), CORS-Preflights exponieren `Idempotency-Key` und JS `publishBoundary` sendet den Header automatisch; Tracker/Doks synchronisiert, Nicht-JS-Bridges & Alerts bleiben offen.
- Next Hook: Nicht-JS-/CLI-Publisher auf Header-Pflicht prüfen und Dedupe-/Observe-Alerts (Dedupes/min, Cache, 409-Ratio) verankern.

What changed

- `scripts/boundary-service.ts` · `/metrics` zählt jetzt `boundary_observe_total{result}` & `boundary_idempotency_missing_total`, `OPTIONS /boundary/observe` liefert CORS-Expose-Header und aktive Spans setzen `boundary.event_key`/`boundary.dedupe.hit`.
- `scripts/smoke/boundary-service-smoke.mjs` · Smoke prüft Header-Expose, Preflight, neue Counter und fehlende Idempotency-Zähler.
- `docs/boundary/GettingStarted.md` · Ergänzt Prometheus-/Preflight-Beispiele für die neuen Header und Zähler.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Statusabschnitt dokumentiert das Observability-Update (`boundary_observe_total`, CORS, OTel).
- `MandalaMap.(md|json|yaml)` · Automation-Sektion notiert das Boundary-Service-Observability-Update.
- `analysis/devtalk96-evaluation.md` · Metrics-Zeile beschreibt die neuen Counter & Preflight, Command-Section ergänzt OPTIONS-Check.
- `src/boundary/publisher.ts` · Default-HTTP-Fallback setzt `Idempotency-Key` (Validierung inkl. Canonical-Fallback).
- `tests/boundary/publisher.test.ts` · Vitest deckt auto-generierte vs. manuell gesetzte Keys und Header-Weitergabe ab.
- `docs/runbooks/sigil-publisher.md` · Boundary-Coupling Abschnitt erwähnt den Auto-Header für JS-Bridges + Follow-up für andere Implementierungen.
- `codexfeedback.(md|json|yaml)` & `codexfeedback/codexfeedback-latest.(json|yaml)` · Tracker auf Fraktal98 gehoben, Hook aktualisiert.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal98.yaml` · Lauf dokumentiert (Auto-Header, Tests, Docs).

Validate

- `node scripts/smoke/boundary-service-smoke.mjs`
- `pnpm vitest run tests/boundary/publisher.test.ts`

Refs

- src/boundary/publisher.ts
- tests/boundary/publisher.test.ts
- docs/runbooks/sigil-publisher.md
- docs/roadmap/v1.0-stabilization-playbook.md
- docs/roadmap/v1.0-stabilization-playbook.yaml
- MandalaMap.(md|json|yaml)
- codexfeedback.(md|json|yaml)
- analysis/devtalk96-evaluation.md
