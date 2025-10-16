# DevTalk96 Evaluation – Boundary Idempotency & Ops Badges

## Kontext

- **Quelle**: `DevTalk.txt` – Follow-up von Aeon (Fraktal95) mit Fokus auf Idempotency-Key Alignment, dedupe Telemetrie, Startup Safety und UI-Ops-Badges.
- **Ziel**: Prüfen, welche Empfehlungen umgesetzt wurden (Header, Metrics, Status-Route, UI) und welche Restaufgaben offen sind.
- **Artefakte geprüft**: `scripts/boundary-service.ts`, `scripts/smoke/boundary-service-smoke.mjs`, `apps/ui/src/pages/BoundaryDemo.tsx`, `docs/boundary/GettingStarted.md`, `docs/runbooks/sigil-publisher.md`, `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)`, `MandalaMap.(md|json|yaml)`, `codexfeedback/*`.

## Umsetzungsstand gegenüber DevTalk-Anforderungen

| Bereich                | DevTalk-Anforderung                                                      | Status Fraktal97                                                                                                 | Hinweise & Folgeaktionen                                                                            |
| ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Idempotency Alignment  | `Idempotency-Key` Header spiegeln, Fallback auf kanonische Keys          | ✅ Boundary-Service liest Header, validiert SHA1, fallback auf `stableBoundaryEventKey`, echo in 202/409 + Body  | JS-`publishBoundary` sendet Header jetzt automatisch; Nicht-JS-Pipelines auf Header-Pflicht prüfen. |
| Startup Safety & Cache | `.tmp` Snapshots aufräumen, dedupe Cache wärmen                          | ✅ Bootstrapping entfernt `laws.json.tmp`, liest letzte JSONL-Linien (limitierbar) und aktualisiert Gauge/Status | Warm-Limit per Config beobachten, ggf. adaptive Strategie.                                          |
| Metrics & Status       | Neue Counters (`response family`, `snapshot errors`), `/boundary/status` | ✅ Prometheus Counter ergänzt; `/metrics` liefert zusätzlich `boundary_observe_total{result="accepted            | duplicate                                                                                           | invalid"}`&`boundary_idempotency_missing_total`, `/boundary/status` meldet Dedupes/min, Cache-Size, letzte 409, Snapshot-Errors, JSON-Status; Preflight (`OPTIONS`) exponiert `Idempotency-Key` | Alerts/Thresholds definieren (Grafana Panel) |
| Smoke Coverage         | Header/Status prüfen                                                     | ✅ Smoke-Skript testet Header-Echo, Status.json, `/boundary/status` Response                                     | Langfristig optional: property-based Tests für canonical.                                           |
| UI Badges              | Dedupes/min & Store-Size sichtbar machen                                 | ✅ Boundary Demo zeigt Dedupes/min & Cache-Badges inkl. "Letzter 409" Hinweis, zieht Daten aus `status.json`     | Badge auch im Dashboard/Tile überlegen.                                                             |
| Docs & Runbooks        | Header Guidance, Curl Beispiele                                          | ✅ GettingStarted.md zeigt 202/409/Status Curl, Runbook fordert Idempotency-Key                                  | Weitere Runbooks (Publisher) auf Header verweisen.                                                  |
| Observability Docs     | Stabilization-Playbook & MandalaMap aktualisieren                        | ✅ MD/YAML + MandalaMap._ dokumentieren Fraktal97 inkl. CORS-/Metrics-Update, codexfeedback_ setzt neuen Hook    | Alerts implementieren (Grafana, PrometheusRule).                                                    |

## Offene Punkte

1. **Publisher Rollout (Non-JS)** – Prüfen, ob Python/Go/CLI-Pfade bereits `Idempotency-Key` mitsenden oder aktualisieren.
2. **Alert Tuning** – Grafana Panels/Alerts für Dedupes/min & Cache-Limit konfigurieren (inkl. SLO Burn Rate).
3. **Property Tests (optional)** – Fuzzing für `stableBoundaryEventKey` permutations (siehe Aeon Vorschlag #5).

## Empfohlene Befehle

- `node scripts/smoke/boundary-service-smoke.mjs`
- `curl -X OPTIONS -i http://127.0.0.1:4010/boundary/observe`

## Status

- Fraktal97 erfüllt die Idempotency-/Ops-Anforderungen des DevTalks; Wiederholung nur bei fehlender Publisher-Rollout-Doku oder Alerting-Konfiguration nötig.
