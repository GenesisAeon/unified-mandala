# DevTalk99 Evaluation – Ethics Fail-Closed & Verify-Gate Hardening

## Kontext

- **Quelle**: `DevTalk.txt` Fokus auf Stabilisierung der Terminal-of-Trust-Pipeline (Ethics ↔ Verify ↔ Upstream) inklusive Observability, CI/Smoke und Policy-Gates.
- **Fragestellung**: Verhindern, dass Boundary-Ausfälle "grün" durchlaufen und sicherstellen, dass Verify-Gate authentifizierte Requests nicht entkernt.
- **Ziel**: Fail-Closed Verhalten etablieren, Header-Weitergabe sichern, Observability & Tests erweitern und den Hook für weitere Hardening-Schritte definieren.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich                | DevTalk-Empfehlung                                              | Status & Umsetzung                                                                                                                                                  | Folgeaktionen                                             |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Ethics Fail-Closed     | Boundary-Abhängigkeit darf bei Ausfall nicht grün durchrutschen | **Umgesetzt:** Circuit-Breaker, `ETHICS_DEP_FAIL_MODE`, `/readyz`, Prometheus (`ethics_dependency_unreachable_total`, `boundary_circuit_state`) + Shared fetchJson. | Circuit-Open Alerts & Dashboard ergänzen.                 |
| Verify Proxy Integrity | Upstream-Auth darf nicht verloren gehen                         | **Umgesetzt:** Verify-Gate übernimmt Authorization/Cookie-Header, setzt `x-ethics-*`, filtert Hop-by-Hop, 5xx bei Ethics-Ausfall.                                   | Rate-Limits & Allowlist/SSRFGates evaluieren.             |
| Observability          | Metriken & Docs für neue Guards                                 | **Umgesetzt:** Stabilization-Playbook (MD/YAML), MandalaMap (md/json/yaml) dokumentieren Circuit/Headers; `.env.example` listet neue Envs.                          | Boundary Alerts (Dedupes/min vs Circuit-State) aufnehmen. |
| Tests & CI             | Smokes/Vitest für kritische Pfade                               | **Umgesetzt:** Supertest/Vitest für Fail-Closed + Header-Forwarding (`pnpm vitest run ...`).                                                                        | In CI aufnehmen / Smoke-Suite erweitern.                  |

## Umsetzung dieses Laufs

1. **Circuit-Breaker & Metrics** – `apps/ethics-api/src/index.ts` + neue Helper-Dateien (`boundary-client.ts`, `circuit-breaker.ts`, `http-client.ts`) liefern Fail-Closed-Response, Counter/Gauge und `/readyz`.
2. **Verify-Gate Header Forwarding** – `apps/verify-gate/src/index.ts` übernimmt Client-Header, setzt Verdict-Metadaten, nutzt Timeout und liefert 5xx bei Ethics-Ausfällen.
3. **Tests & Tooling** – Neue Vitest/Supertest-Suites decken Fail-Closed- und Header-Flows ab; `.env.example`, Stabilization-Playbook, MandalaMap und codexfeedback aktualisiert.

## Offene Aufgaben (Hooks)

- **Circuit-Open Alerting** – Boundary circuit state (Gauge) in Grafana/Alertmanager verdrahten.
- **Verify-Gate Limits** – Rate-Limits/Allowlist/SSRF-Guards evaluieren; ggf. Token-Isolation pro upstream.
- **CI-Integration** – Neue Tests in verpflichtende Vitest-Läufe aufnehmen (`pnpm vitest run apps/...`).

## Empfehlung für nächste Schritte

- `pnpm vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts`
- Boundary Circuit Gauge in Observability-Dashboards + Alerts integrieren.

## Status

- Ethics & Verify-Gate Fail-Closed-Rollout abgeschlossen; weitere Hardening-Schritte (Alerts/Rate-Limits) als nächster Hook.
