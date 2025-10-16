# Codexfeedback – Fraktal 98

- Phase: Boundary Idempotency & Ops badges
- Status: Boundary-Service exportiert neue `/metrics`-Zähler (`boundary_observe_total`, `boundary_idempotency_missing_total`), CORS-Preflights exponieren `Idempotency-Key`, JS `publishBoundary` sendet den Header automatisch **und** Vitest nutzt Zero-Build-Exports (`packages/ai` + `vitest.config.ts`); Tracker/Doks synchronisiert, Nicht-JS-Bridges, Alerts & weitere Workspace-Audits bleiben offen.
- Next Hook: Nicht-JS-/CLI-Publisher auf Header-Pflicht prüfen, Dedupe-/Observe-Alerts (Dedupes/min, Cache, 409-Ratio) verankern und weitere Pakete auf `vitest`-Exports prüfen.

What changed

- `scripts/boundary-service.ts` · `/metrics` zählt jetzt `boundary_observe_total{result}` & `boundary_idempotency_missing_total`, `OPTIONS /boundary/observe` liefert CORS-Expose-Header und aktive Spans setzen `boundary.event_key`/`boundary.dedupe.hit`.
- `scripts/smoke/boundary-service-smoke.mjs` · Smoke prüft Header-Expose, Preflight, neue Counter und fehlende Idempotency-Zähler.
- `docs/boundary/GettingStarted.md` · Ergänzt Prometheus-/Preflight-Beispiele für die neuen Header und Zähler.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Statusabschnitt dokumentiert das Observability-Update (`boundary_observe_total`, CORS, OTel).
- `MandalaMap.(md|json|yaml)` · Automation-Sektion notiert das Boundary-Service-Observability-Update.
- `packages/ai/package.json` · Konditionale `vitest`/`test`/`development`-Exports erlauben Tests ohne vorab gebauten `dist/`-Ordner.
- `vitest.config.ts` · `resolve.conditions` priorisieren Source-Exports während Vitest-Läufen.
- `analysis/devtalk98-evaluation.md` · DevTalk-Abgleich bestätigt Zero-Build Fix & verbleibende Hooks.
- `analysis/devtalk96-evaluation.md` · Metrics-Zeile beschreibt die neuen Counter & Preflight, Command-Section ergänzt OPTIONS-Check.
- `src/boundary/publisher.ts` · Default-HTTP-Fallback setzt `Idempotency-Key` (Validierung inkl. Canonical-Fallback).
- `tests/boundary/publisher.test.ts` · Vitest deckt auto-generierte vs. manuell gesetzte Keys und Header-Weitergabe ab.
- `docs/runbooks/sigil-publisher.md` · Boundary-Coupling Abschnitt erwähnt den Auto-Header für JS-Bridges + Follow-up für andere Implementierungen.
- `codexfeedback.(md|json|yaml)` & `codexfeedback/codexfeedback-latest.(json|yaml)` · Tracker auf Fraktal98 gehoben, Hook aktualisiert.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal98.yaml` · Lauf dokumentiert (Auto-Header, Tests, Docs).

Validate

- `node scripts/smoke/boundary-service-smoke.mjs`
- `pnpm vitest run tests/boundary/publisher.test.ts`
- `pnpm vitest run`

Refs

- src/boundary/publisher.ts
- tests/boundary/publisher.test.ts
- docs/runbooks/sigil-publisher.md
- docs/roadmap/v1.0-stabilization-playbook.md
- docs/roadmap/v1.0-stabilization-playbook.yaml
- MandalaMap.(md|json|yaml)
- codexfeedback.(md|json|yaml)
- packages/ai/package.json
- vitest.config.ts
- analysis/devtalk96-evaluation.md
- analysis/devtalk98-evaluation.md
