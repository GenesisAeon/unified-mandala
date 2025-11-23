# DevTalk102 Evaluation – Ethics & Verify-Gate Hardening

## Kontext

- **Quelle**: `DevTalk.txt` Abschnitt Fraktal102 (Quick-Wins für Ethics-API, Verify-Gate, UI & Observability).
- **Fragestellung**: Welche Sofortmaßnahmen erhöhen Resilienz und Transparenz des fail-closed Ethics-Gates? Fokus auf Payload-Validierung, Request-Korrelation, SSRF-Guards, Streaming und UI-Sichtbarkeit.
- **Ziel**: Bewertung der DevTalk-Empfehlungen, Umsetzungsschritte dokumentieren, Folge-Hooks festlegen.

## Abgleich mit DevTalk-Schwerpunkten

| Bereich               | DevTalk-Empfehlung                                                 | Umsetzung & Status                                                                                                                                                                                                              | Folgeaktionen                                                         |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Ethics-API Validation | Ajv-Schema, Circuit-gekoppelte Readiness, Request-ID weiterreichen | `apps/ethics-api` nutzt `EthicsCheckSchema`, generiert `x-request-id`, koppelt `/readyz` an `boundary_circuit_state` (cb 0/1/2) und reicht optional `INTERNAL_BEARER` + Request-ID an Boundary/RAG. Tests decken 400-Fehler ab. | Boundary-Alerts (Prometheus/Grafana) vervollständigen.                |
| Verify-Gate Hardening | Rate-/Body-Limits, SSRF-Allowlist, Streaming, Header-Expose        | `apps/verify-gate` setzt `GATE_JSON_LIMIT`, `VERIFY_RATE_RPS`, Allowlist & Same-Host-Flag, streamt Upstream-Responses via `Readable.fromWeb` und exponiert `x-ethics-*` via CORS. Request-ID fließt zum Ethics-Check.           | End-to-End Streaming (UI ↔ Verify-Gate) beobachten, Alerts aufbauen. |
| Observability & Smoke | Smoke-Check für Health/Ethics/Verify/Chat, Dashboard               | `scripts/smoke/live-smoke.mjs` pingt Health, Verify-Gate, Ethics `/readyz`, Chat. Neues Grafana-Dashboard `mandala-ethics-gate.json` visualisiert Verdicts, Latenz, Failclosed, RPS.                                            | Alerts & Dashboard-Verlinkung in Runbooks ergänzen.                   |
| UI Feedback           | Ethics-Badge, Header-Expose nutzen                                 | `apps/ui` erhält `EthicsBadge`, `fetchJsonWithEthics`, `streamWithEthics`; Playground zeigt Verdict/Evidence sofort.                                                                                                            | Streaming-Konversationen (SSE) auf Badge aktualisieren.               |

## Umsetzung dieses Laufs

1. **Ethics-API** – Ajv-Validierung (`EthicsCheckSchema`), Request-ID Middleware, Circuit-basierte `/readyz`, optionale `INTERNAL_BEARER`-Tokens.
2. **Verify-Gate** – JSON-/Rate-Limits, SSRF-Allowlist, Streaming-Proxying, CORS-Expose für `x-ethics-*`, Request-ID Forwarding.
3. **UI/Observability** – EthicsBadge & Fetch-Wrapper, erweitertes Live-Smoke, neues Grafana-Dashboard, `.env.example` & Docs aktualisiert.
4. **Tests** – Vitest/Supertest decken Schema-400, Header-Expose, Rate-Limit-Abwehr ab; DevTalk-Eval dokumentiert Umsetzung.

## Offene Aufgaben (Hooks)

- **Alerting** – Boundary/Ethics Metriken (Circuit-Open, Failclosed, SSRF) in Grafana/Prometheus alarmieren.
- **Streaming UI** – Live-Streaming (SSE/Chunked) im Playground mit Echtzeit-Badge aktualisieren.

## Empfehlung für nächste Schritte

- `pnpm vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts`
- `pnpm smoke:live --json` – neue Health/Verify/Ethics/Chat Checks validieren.
- Grafana-Dashboard importieren (`grafana/dashboards/mandala-ethics-gate.json`) und Alarmregeln definieren.

## Status

- Fraktal102 umgesetzt: Ethics-API & Verify-Gate sind härter (Validation, Rate-Limits, Streaming), UI & Observability zeigen Verdicts sofort; Alerting & Streaming-E2E bleiben aktiv.
