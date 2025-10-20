# Codexfeedback – Fraktal 112 IPv6 Observability

- Phase: Verify-Gate Hardening Finish (IPv6/TLS Signals)
- Status: TLS-Preflight vergleicht normalisierte IPv6-Remote-Adressen, NAT64/Teredo-Präfixe stehen auf der Blockliste und `x-verify-network` liefert TTL/Redirect/TLS-Level an OPA & UI. Mandala Playground zeigt NetworkRiskBadges; Prometheus Recording-Rules/Alerts decken TLS/IP-Mismatch & DNS TTL p95, Grafana ergänzt Panels. `pnpm lint:format` ergänzt die Format-Pipeline.
- Next Hook: Chaos-DNS-Rebind & Redirect-Loop Drills bauen, Alertmanager-Routing + README-Badges dokumentieren, `pnpm lint:format` in CI integrieren.

What changed

- `apps/verify-gate/src/security/ipRanges.ts` entfernt Scope-IDs vor dem Normalisieren, erweitert NAT64/Teredo-Blocklisten.
- `apps/verify-gate/src/security/tlsPreflight.ts` + `src/index.ts` normalisieren Remote-IP, setzen `x-verify-network` und reichen TLS-Netzkontext an OPA weiter; Tests (`ip-ranges.test.ts`, `tls-preflight.test.ts`) decken die Pfade.
- `apps/ui/src/lib/fetchWithEthics.ts` parst Netzwerk-Signale; `NetworkRiskBadges.tsx` + Mandala Playground visualisieren TTL-/Redirect-/TLS-Risiken.
- `observability/prometheus/recording-rules.yaml`, `observability/alerts/verify-gate.yaml`, `grafana/dashboards/verify-gate-ethics-mini.json` ergänzen TLS/IP-Mismatch-Rate & DNS TTL p95 Panels/Alerts.

Validate

- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/ip-ranges.test.ts
- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/tls-preflight.test.ts
- pending: pnpm lint:types
