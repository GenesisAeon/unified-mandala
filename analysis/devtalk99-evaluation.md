# DevTalk99 Evaluation – Boundary Server Parity

## Kontext

- **Quelle**: `DevTalk.txt` (Aeon · Fraktal95 Nachgang) – Fokus auf Server-Parität für Boundary (`Idempotency-Key`, CORS, Metriken, Tests, Docs).
- **Ziel**: Prüfen, ob die vorgeschlagenen Server/Observability-Schritte umgesetzt wurden (CORS-Expose, Header-Echo, Metriken, Smoke-Tests, Tracker).
- **Artefakte geprüft**: `scripts/boundary-service.ts`, `scripts/smoke/boundary-service-smoke.mjs`, `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`, `MandalaMap.(md|json|yaml)`, `codexfeedback/*`.

## Umsetzungsstand gegenüber DevTalk-Anforderungen

| Bereich        | DevTalk-Anforderung                                                                | Status Fraktal99                                                                                                                      | Hinweise & Folgeaktionen                                                           |
| -------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Header Parität | `Idempotency-Key` vom Client übernehmen, fallback + Echo im Response               | ✅ Bereits seit Fraktal97 aktiv (`scripts/boundary-service.ts`), Smoke prüft Header/Payload.                                          | Non-JS Publisher weiterhin überwachen (Hook im Tracker).                           |
| CORS Exposure  | `Access-Control-Allow/Expose-Headers` für `Idempotency-Key`, Preflight beantworten | ✅ `OPTIONS` liefert Allow/Expose mit `Idempotency-Key`, alle JSON-Routen setzen Origin/Expose. Smoke-Skript prüft Preflight/Headers. | Optional: Origin-Whitelist via Env (`BOUNDARY_CORS_ALLOW_ORIGIN`) definieren.      |
| Metriken       | Low-card Counters (`boundary_observe_total`, `boundary_idempotency_missing_total`) | ✅ Prom-Registry zählt accepted/duplicate/invalid/error + fehlende Header; `/metrics` spiegelt Werte, Smoke verifiziert.              | Alerts (409-Ratio, Missing Header Spike) noch zu konfigurieren (Grafana/PromRule). |
| Smoke/Tests    | Header Echo, Duplicate Flow, Missing Header, Preflight                             | ✅ `scripts/smoke/boundary-service-smoke.mjs` deckt 202/409, kanonische Keys, fehlende Header, Preflight & Prometheus ab.             | Langfristig optional: Property/Fuzz Tests für Canonical Keys.                      |
| Docs & Tracker | Playbook, MandalaMap, Codexfeedback aktualisieren                                  | ✅ Stabilization-Playbook + MandalaMap + codexfeedback referenzieren Fraktal99 Server-Parität & Hook.                                 | Alerts/Badge-Status in Docs nachziehen, sobald verfügbar.                          |

## Offene Punkte

1. **Alerting hinterlegen** – `boundary_observe_total` (409 Ratio) & `boundary_idempotency_missing_total` Schwellen in Grafana/PrometheusRules definieren.
2. **Publisher-Gleichstand** – Nicht-JS/CLI Clients auf `Idempotency-Key`-Pflicht prüfen (Hook im Codexfeedback markiert Follow-up).

## Empfohlene Befehle

- `node scripts/smoke/boundary-service-smoke.mjs`

## Status

- Fraktal99 schließt die Server-Paritätsanforderungen aus dem DevTalk. Wiederholung nur notwendig, falls Alerting/Publisher-Nachzug nicht erfolgt.
