# Codexfeedback – Fraktal 98

- Phase: Boundary Idempotency & Ops badges
- Status: JS `publishBoundary` sendet den `Idempotency-Key`-Header automatisch; Docs & Tracker spiegeln den Rollout, Nicht-JS-Bridges bleiben als Follow-up.
- Next Hook: Nicht-JS-/CLI-Publisher auf Header-Pflicht prüfen und Dedupe-Alerts (Dedupes/min vs. Cache) verankern.

What changed

- `src/boundary/publisher.ts` · Default-HTTP-Fallback setzt `Idempotency-Key` (Validierung inkl. Canonical-Fallback).
- `tests/boundary/publisher.test.ts` · Vitest deckt auto-generierte vs. manuell gesetzte Keys und Header-Weitergabe ab.
- `docs/runbooks/sigil-publisher.md` · Boundary-Coupling Abschnitt erwähnt den Auto-Header für JS-Bridges + Follow-up für andere Implementierungen.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Status-Abschnitt ergänzt den Publisher-Rollout.
- `MandalaMap.(md|json|yaml)` · Automation-Sektion notiert den Idempotency-Publisher-Hook.
- `codexfeedback.(md|json|yaml)` & `codexfeedback/codexfeedback-latest.(json|yaml)` · Tracker auf Fraktal98 gehoben, Hook aktualisiert.
- `analysis/devtalk96-evaluation.md` · Idempotency-Row verweist auf JS-Auto-Header, Follow-up betont Nicht-JS-Pfade.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal98.yaml` · Lauf dokumentiert (Auto-Header, Tests, Docs).

Validate

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
