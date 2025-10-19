# DevTalk106 Evaluation – Observability & Rotation

## Kontext

- **Quelle**: `DevTalk.txt` (Fraktal106) – Restarbeiten für Prometheus/Grafana, JWT-Rotation sowie OPA-Bundle-Distribution.
- **Fragestellung**: Welche Sofortmaßnahmen stabilisieren Verify-Gate & Ethics-API für die letzten 5 % (Metriken, Secret-Rotation, Chaos-Proben, UI-Sichtbarkeit)?
- **Ziel**: Umsetzung der DevTalk-Hooks, Dokumentation der Maßnahmen und neue Follow-ups für Grafana/Alerts.

## Quick Summary

- Verify-Gate extrahiert Prometheus-Setup nach `metrics.ts` und zählt jetzt Idempotency-Hits, SSRF-Blocks (mit Host-Label), Token-Fails (mit Reason) sowie Histogram-Latenzen (`method/route/code`). SSRF-Denies & Token-Sign-Fehler schlagen im Counter an; fehlende Secrets liefern saubere 500er.
- Verdict-Tokens rotieren via `VERIFY_GATE_JWT_SECRETS` + `VERIFY_GATE_JWT_ACTIVE_KID` (kid-Header). Upstream `verifyEthics` dekodiert `kid` und wählt Secrets aus dem Mapping oder dem Legacy-Fallback.
- Ethics-API evaluiert Bundles über `ETHICS_OPA_ENABLE`/`ETHICS_OPA_PATH` (`apps/ethics-api/opa/policy.rego`) mit stdin-input, liefert `evidence_domains_distinct` an Policies und bleibt beim Timeout fail-closed.
- Mandala-Playground zeigt EvidenceChips (Domain-Anzahl & Strong-Badges) für `verifyBlock`-Evidenz.
- Chaos-Skript `pnpm chaos:ethics` erhält das Szenario `--scenario boundary-down` (Kill via `lsof`) + Fail-Closed-Assert; `ci.nightly.yml` führt den Drill aus.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                      | DevTalk-Ziel                                                                      | Umsetzung Fraktal106                                                                                                                                                                                                                                     | Folgeaktionen                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Observability & Metrics      | Verify-Gate soll Idempotency/SSRF/Token-Fail Counter exportieren, Latenzen labeln | `metrics.ts` bündelt Zähler (`verify_gate_idem_hits_total`, `verify_gate_ssrf_block_total{host}`, `verify_gate_token_fail_total{reason}`) und Histogram (`verify_gate_upstream_duration_ms{method,route,code}`); SSRF-Denies & 428/401 markieren Gründe. | Grafana-Panels/Alerts für die neuen Counter anlegen (`rate()`/`topk()`).                     |
| Governance & Secret-Rotation | JWT-Verdicts mit `kid`, Upstream akzeptiert mehrere Secrets                       | `VERIFY_GATE_JWT_SECRETS` + `VERIFY_GATE_JWT_ACTIVE_KID` aktiv, `verifyEthics` mappt kid→Secret (Buffer oder Fallback).                                                                                                                                  | Runbook für Secret-Rotation (aktiv setzen, Upstream erlauben, alten Key entfernen) ergänzen. |
| OPA Delivery                 | Mini-Bundle + CLI-Hook, Fail-Closed                                               | `ETHICS_OPA_ENABLE` + `ETHICS_OPA_PATH` starten `opa eval` (execFile, stdin-input), Policy `apps/ethics-api/opa/policy.rego` deny: intent/Domain-Checks; `evidence_domains_distinct` wird übergeben.                                                     | Bundle-Build in CI (Artefakt) & Grafana Badge „OPA active“ ergänzen.                         |
| UI Visibility                | Evidence-Stärke & Domain-Diversität im Playground                                 | EvidenceChips zeigen Domain-Count und Strong-Badges; Tooltip enthält URL.                                                                                                                                                                                | Optional Filter „Strong only“ laut DevTalk-Kleinhook.                                        |
| Chaos/Nightly                | Boundary-Down Fail-Closed Drill automatisieren                                    | `pnpm chaos:ethics --scenario boundary-down --expect failclosed` killt Port, prüft Status/Veridikt; `ci.nightly.yml` startet Stack + Drill.                                                                                                              | Boundary-/Ethics-Logs im Nightly anhängen; Alert bei Nicht-Fail-Closed.                      |

## Offene Hooks

- **Grafana**: Panels/Alerts für `verify_gate_idem_hits_total`, `verify_gate_ssrf_block_total`, `verify_gate_token_fail_total` bauen.
- **Runbooks**: Secret-Rotation (`VERIFY_GATE_JWT_SECRETS`), OPA-Bundle-Pipeline dokumentieren.
- **UI**: Optionaler Strong-Filter, Domain-Badges in anderen UIs wiederverwenden.

## Empfohlene Checks

- `pnpm -w vitest run apps/verify-gate/src/__tests__/idempotency.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm chaos:ethics --scenario boundary-down --expect failclosed`

## Status

- Fraktal106 liefert Metriken + JWT-Rotation + OPA-Hook + Chaos/Nightly-Abdeckung. Folgearbeit konzentriert sich auf Grafana/Alerts & Runbook-Updates.
