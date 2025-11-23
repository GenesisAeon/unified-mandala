# DevTalk 112 – Verify-Gate IPv6 Hardening & Observability Finish

## Quelle & Kontext

- Quelle: `DevTalk.txt` Stabilization-Plan (CI/Lint, Observability, Governance) mit Fokus auf Verify-Gate Nacharbeiten.
- Scope Fraktal112: IPv6/IP-Mismatch P1-Fix, NAT64/Teredo Blocklisten, UI-Risiko-Signale und Monitoring-Dashboards/Alerts.
- Ziel: Offene Punkte aus Fraktal111 (IPv6 Normalisierung, Grafana/Alert Panels, UI-Badges) abschließen und DevTalk-Empfehlungen evaluieren.

## Umsetzung Fraktal112

1. **IPv6 Normalisierung & Blocklisten**
   - `security/ipRanges.ts` entfernt Scope-IDs (`fe80::1%eth0`), normalisiert IPv6 und erweitert die Blocklisten um NAT64 (`64:ff9b:1::/48`) sowie Benchmark-/Teredo-Präfixe (`2001:2::/48`, `2001:10::/28`).
   - Vitest (`ip-ranges.test.ts`, `tls-preflight.test.ts`) decken Zonencleanup und IPv6-Vergleich ab; TLS-Preflight liefert jetzt normalisierte Remote-IPs.
2. **TLS-Preflight & Netzwerk-Signale**
   - `index.ts` vergleicht gepinnte Adressen mit `normalizeIp`, hängt Netzsignal-Header `x-verify-network` (TTL-Level, Redirect-Hops, TLS-Status) an Antworten an und speist OPA mit `tls_remote_ip`/`tls_san_ok`.
   - UI (`fetchWithEthics.ts`, `NetworkRiskBadges.tsx`, `MandalaAIPlayground.tsx`) rendert Badges für TTL-, Redirect- und TLS-Risiken.
3. **Observability Finish**
   - Prometheus Recording-Rule `rate:verify_gate_tls_name_mismatch_total_5m`, Alerts für TLS/IP-Mismatch und Grafana-Panels (`DNS TTL p95`, `TLS/IP mismatches`).
   - `package.json` ergänzt `lint:format` als DevTalk-Hinweis auf Format-Pipeline.

## Bewertung DevTalk-Forderungen

| DevTalk-Schwerpunkt                | Status Fraktal112                                                    | Nächste Schritte                                  |
| ---------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| IPv6 Normalisierung / NAT64 Listen | ✅ Normalisierung + NAT64/Teredo Blocklisten + Tests                 | Chaos-Drill TTL-Rebind, NAT64 Replay              |
| Grafana Panels & Alerts            | ✅ TLS/IP Alerts + Dashboard-Panels für TTL & Preflight              | Alertmanager Routing, README Badges               |
| UI-Badges für DNS/TLS Risiken      | ✅ NetworkRiskBadges in Mandala Playground (TTL/Redirect/TLS)        | Optional: Ethics-Leiste im mandala-ui Root        |
| Format/Lint Pipeline               | ✅ `lint:format` läuft im `ci.core` Gate                             | Optional: Husky-Hook/Nightly Spiegelung           |
| Chaos/Smoke Tests (DNS Rebinding)  | ✅ Chaos-Drills (`pnpm chaos:verify-dns-rebind`, `...redirect-loop`) | Alert-Runbooks, ggf. zusätzliche Replay-Szenarien |

## Restaufgaben / Hooks

- Alertmanager/Webhook Routing dokumentieren, README Badge für TLS/IP Alerts.
- Husky/Docs: Entscheiden, ob `pnpm lint:format` vor Ort (pre-commit) laufen soll oder optional bleibt.
- UI: optional global Einbindung der Netzwerk-Badges (Ethics-Bar in mandala-ui Shell).

> Fazit: Fraktal112 schließt die P1-Bugs (IPv6 mismatch) und macht die TLS/DNS-Risiken sicht- und alertbar. Chaos-Drills laufen jetzt automatisiert (Vitest-Harness + Nightly), Format-Checks sind Teil der CI; verbleibend ist vor allem die Dokumentation rund um Alertmanager und optionale UX-Politur.
