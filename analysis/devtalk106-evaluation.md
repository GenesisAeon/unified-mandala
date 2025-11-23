# DevTalk106 Evaluation – Observability & Rotation

## Kontext

- **Quelle**: `DevTalk.txt` (Fraktal106) – Restarbeiten für Prometheus/Grafana, JWT-Rotation sowie OPA-Bundle-Distribution.
- **Fragestellung**: Welche Sofortmaßnahmen stabilisieren Verify-Gate & Ethics-API für die letzten 5 % (Metriken, Secret-Rotation, Chaos-Proben, UI-Sichtbarkeit)?
- **Ziel**: Umsetzung der DevTalk-Hooks, Dokumentation der Maßnahmen und neue Follow-ups für Grafana/Alerts.

## Quick Summary

- Verify-Gate persistiert Idempotency-Keys via `apps/verify-gate/src/idempotency/store.ts` (better-sqlite3, `VERIFY_GATE_IDEMP_DB`, TTL `VERIFY_GATE_IDEMP_TTL_MS`), Safelistet Header (authorization/cookie/user-agent/accept/accept-language/content-type/x-request-id/x-forwarded-for/x-forwarded-proto/x-ethics-token), setzt `X-Verify-Degraded` und hält Prometheus-Counter/Histogramme in `metrics.ts`.
- Verdict-Tokens rotieren via `VERIFY_GATE_JWT_SECRETS`/`VERIFY_GATE_JWT_ACTIVE_KID`; `apps/api/src/__tests__/ethics-token-guard.test.ts` prüft Legacy/Rotation/Drop, `docs/runbooks/verify-gate-jwt-rotation.md` dokumentiert den Ablauf.
- `apps/ethics-api/opa/policy.rego` verlangt starke Evidenz bei Fakten und verweigert bei `input.degraded == true`; `pnpm chaos:ethics --scenario boundary-down --expect failclosed` bleibt Nightly-Drill (`ci.nightly.yml`).
- `apps/api/src/middleware/verifyEthics.ts`, `apps/ui/src/lib/fetchWithEthics.ts` und `MandalaAIPlayground.tsx` propagieren `X-Verify-Degraded` bis zur UI (Fail-closed-Banner + Quelle), MandalaMap./codexfeedback.\* führen neue Knobs auf.
- Grafana bündelt Verify-Gate-Metriken im Mini-Dashboard `grafana/dashboards/verify-gate-ethics-mini.json` (Idempotency, SSRF, Token-Fails, Upstream-p95, Ethics-Degradation) und Prometheus-Alerts `observability/alerts/verify-gate.yaml` feuern bei Replay-/SSRF-/Token-Spitzen.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                      | DevTalk-Ziel                                                                      | Umsetzung Fraktal106                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Folgeaktionen                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Observability & Metrics      | Verify-Gate soll Idempotency/SSRF/Token-Fail Counter exportieren, Latenzen labeln | Persistenter Idempotency-Store (`apps/verify-gate/src/idempotency/store.ts`, `VERIFY_GATE_IDEMP_DB`), Safelist (auth/cookie/user-agent/accept/accept-language/content-type/x-request-id/x-forwarded-for/x-forwarded-proto/x-ethics-token) und `X-Verify-Degraded` laufen über `index.ts`; `metrics.ts` liefert Counter/Histo und das Grafana-Mini-Dashboard `grafana/dashboards/verify-gate-ethics-mini.json` plus Alerts `observability/alerts/verify-gate.yaml` visualisieren die Werte. | Alerts ins Ops-Runbook aufnehmen (Alertmanager/Webhook) und Monitoring-Profil referenzieren. |
| Governance & Secret-Rotation | JWT-Verdicts mit `kid`, Upstream akzeptiert mehrere Secrets                       | `VERIFY_GATE_JWT_SECRETS` + `VERIFY_GATE_JWT_ACTIVE_KID` aktiv, Rotation-Runbook (`docs/runbooks/verify-gate-jwt-rotation.md`) dokumentiert den Ablauf; Tests decken Legacy/Drop ab.                                                                                                                                                                                                                                                                                                       | Rotation-Drill regelmäßig fahren, Secrets in Ops-Runbooks verlinken.                         |
| OPA Delivery                 | Mini-Bundle + CLI-Hook, Fail-Closed                                               | `apps/ethics-api/opa/policy.rego` verlangt jetzt starke Evidenz für Fakten und verweigert bei `input.degraded == true`; `ETHICS_OPA_ENABLE`/`ETHICS_OPA_PATH` laufen via `opa eval`.                                                                                                                                                                                                                                                                                                       | Bundle-Build in CI (Artefakt) & Grafana Badge „OPA active“ ergänzen.                         |
| UI Visibility                | Evidence-Stärke & Domain-Diversität im Playground                                 | `fetchJsonWithEthics` + `MandalaAIPlayground` setzen Fail-closed-Banner inkl. Quelle (`X-Verify-Degraded`), EvidenceChips bleiben erhalten.                                                                                                                                                                                                                                                                                                                                                | Optional Filter „Strong only“ laut DevTalk-Kleinhook.                                        |
| Chaos/Nightly                | Boundary-Down Fail-Closed Drill automatisieren                                    | `pnpm chaos:ethics --scenario boundary-down --expect failclosed` killt Port, prüft Status/Veridikt; `ci.nightly.yml` startet Stack + Drill.                                                                                                                                                                                                                                                                                                                                                | Boundary-/Ethics-Logs im Nightly anhängen; Alert bei Nicht-Fail-Closed.                      |

## Offene Hooks

- **Runbooks**: OPA-Bundle-Pipeline & Grafana-Doku ergänzen.
- **UI**: Optionaler Strong-Filter, Domain-Badges in anderen UIs wiederverwenden.
- **Alerting**: Prometheus/Grafana-Alerts in Alertmanager oder Webhook-Routing verdrahten und Monitoring-README um Dashboard-Link ergänzen.

## Empfohlene Checks

- `pnpm -w vitest run apps/verify-gate/src/__tests__/idempotency.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm chaos:ethics --scenario boundary-down --expect failclosed`

## Status

- Fraktal106 liefert persistenten Idempotency-Store, Safelist, `X-Verify-Degraded`-Propagation, JWT-Rotation-Runbook, OPA-Fail-Closed sowie Grafana-Mini-Dashboard & Prometheus-Alerts. Folgearbeit: Alert-Routing, OPA-Bundle-Artefakte & optionaler UI-Filter.
