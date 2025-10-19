- **Quelle**: `DevTalk.txt` – Stabilization-Plan (CI/CD, Observability, Policy) plus Johann P1 Hinweis auf IPv6-Lücke.
- **Fragestellung**: Brauchen wir zusätzliche Hardening-Schritte aus dem Plan? Welche Sofortmaßnahme schließt die SSRF-Lücke?
- **Ziel**: Fraktal108 abschließen, Verify-Gate gegen AAAA-only Loopback absichern und Telemetrie erweitern.

## Quick Summary

- Verify-Gate resolved jetzt A- und AAAA-Records via `dns.lookup(..., { all: true, verbatim: true })`; `[host]`-Fallback entfällt, Fehler führen fail-closed zu `SSRFDenyError`.
- Neue Prometheus-Counter `verify_gate_ssrf_resolve_error_total` & `verify_gate_ssrf_resolve_empty_total` decken DNS-Fehler/Leere Antworten ab.
- `makePinnedAgent` erhält die aufgelöste IP (Agent-Pinning bleibt konsistent), Tests belegen, dass AAAA-only `::1` blockiert wird.
- Docs (Stabilization-Playbook) und MandalaMap vermerken das Hardening als Teil des Observability-/Security-Streams aus DevTalk.

## DevTalk-Abgleich

| DevTalk-Schwerpunkt        | Bedarf laut Gespräch                                                                | Umsetzung Fraktal108                                                                                   | Folgeaktionen                                                      |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Observability & Monitoring | Monitoring der Gate-Metriken + Fail-closed Verhalten für Upstream-Sicherheitschecks | Neue DNS-bezogene Counter + SSRF-Fail-Closed (keine Host-Fallbacks mehr), AAAA-only Loopback blockiert | Grafana/Alertmanager um DNS-Counter ergänzen                       |
| Policy & Governance        | Fail-fast/Fail-closed Gate, Telemetrie sichtbar machen                              | SSRF-Guard erzwingt deterministische Verdict-Basis, Telemetrie + Tests dokumentieren Lücke & Fix       | Remote-IP-Verifikation & CNAME-Telemetrie als Follow-up evaluieren |
| CI/CD Hardening            | Sicherstellen, dass Tests den Fix abdecken                                          | Vitest-Suite deckt AAAA-only Loopback ab, `ssrf-allowlist.test.ts` prüft Rückgabewert                  | Integration in `pnpm test:unit` sicherstellen                      |

## Offene Punkte

- Grafana/Alertmanager Panels/Alerts für `verify_gate_ssrf_resolve_*` ergänzen.
- Optional Remote-IP-Validierung (connection.remoteAddress gegen DNS) sowie CNAME-Labeling im Metrics-Layer.
- Fraktal-Hook: Sobald Telemetrie in Grafana ausgerollt ist, MandalaMap/codexfeedback aktualisieren.

## Empfohlene Checks

- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts`
- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-aaaa-loopback.test.ts`

## Status

- Fraktal108 erledigt: Verify-Gate blockt AAAA-only Loopback, DNS-Fehler-Metriken vorhanden, Agenten pinnen resolvierte IP.
