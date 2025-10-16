# Codexfeedback – Fraktal 99

- Phase: Boundary Server Parity
- Status: Boundary-Service beantwortet CORS-Preflights mit `Idempotency-Key`, setzt Allow/Expose-Header auf allen JSON-Routen und exportiert `boundary_observe_total` + `boundary_idempotency_missing_total`; Smoke-Test deckt Preflight, fehlende Header und Prometheus-Werte ab.
- Next Hook: Alerts (409-Ratio, Missing Header) konfigurieren und Nicht-JS/CLI-Publisher auf Idempotency-Key-Pflicht prüfen.

What changed

- `scripts/boundary-service.ts` · CORS-Preflight (`OPTIONS`), globale Allow/Expose-Header und neue Prometheus-Counter (`boundary_observe_total`, `boundary_idempotency_missing_total`).
- `scripts/smoke/boundary-service-smoke.mjs` · Prüft Preflight, Header-Expose, fehlende Header sowie Prometheus-Zähler.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Server-Parität (CORS + Metriken) ergänzt.
- `MandalaMap.(md|json|yaml)` · Automation-Notizen & Samples erweitern Boundary-CORS-/Metrik-Hinweis.
- `codexfeedback.(md|json|yaml)` & `analysis/devtalk99-evaluation.md` · Tracker + DevTalk-Abgleich aktualisiert.
- `docs/fraktal/codexfeedback/codexfeedback-fraktal99.yaml` · Lauf dokumentiert.

Validate

- `node scripts/smoke/boundary-service-smoke.mjs`

Refs

- scripts/boundary-service.ts
- scripts/smoke/boundary-service-smoke.mjs
- docs/roadmap/v1.0-stabilization-playbook.md
- docs/roadmap/v1.0-stabilization-playbook.yaml
- MandalaMap.md / MandalaMap.json / MandalaMap.yaml
- codexfeedback.md / codexfeedback.json / codexfeedback.yaml
- analysis/devtalk99-evaluation.md
- docs/fraktal/codexfeedback/codexfeedback-fraktal99.yaml
