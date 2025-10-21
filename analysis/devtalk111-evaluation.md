# DevTalk 111 – Redirect/TLS Close-out & v1.0 Stabilization Hooks

## Quelle & Kontext

- Quelle: `DevTalk.txt` Abschnitt "To stabilize the unified-mandala project for a robust v1.0 release" sowie Aeons Fraktal109/111 Close-out-Plan.
- Ziel: Ableitung der für Fraktal111 relevanten Hardening-Schritte (DNS-TTL-Cache, TLS/SAN-Preflight, Redirect-Validierung) und Abgleich mit verbleibenden Aufgaben aus dem Stabilization-Playbook.
- Scope: Verify-Gate SSRF/TLS Hardening, Observability-Hooks, Policy/Docs Synchronität, Meta-Tracker (`codexfeedback*`, MandalaMap, Playbook).

## Umsetzung Fraktal111

1. **DNS-TTL-Cache & Resolver-Context**
   - Implementiert: `apps/verify-gate/src/security/dnsCache.ts` liefert jittered TTL + Request-Coalescing, wird via `resolveWithCache` im SSRF-Pfad genutzt.
   - Metrics: `verify_gate_dns_ttl_seconds_bucket` bereits vorhanden; Jitter schützt gegen thundering herd.
2. **Redirect-Validierung vor Netz-Hop**
   - `apps/verify-gate/src/proxy/followRedirects.ts` prüft Start-URL über `assertAllowed`, verfolgt Redirects IP-gepinnt und validiert jeden Hop, bevor ein HEAD-Request gesendet wird.
   - `apps/verify-gate/src/index.ts` verwendet den validierten Kontext (Pinned IP, TTL) und blockt vor dem ersten Hop (`verify_gate_ssrf_block_total{reason="preflight"}`).
3. **TLS/SAN-Preflight**
   - `apps/verify-gate/src/security/tlsPreflight.ts` dialt gegen gepinnte IP mit SNI, prüft SAN via `checkServerIdentity`, zählt Mismatches (`verify_gate_ip_mismatch_total`, `verify_gate_tls_name_mismatch_total`).
   - Preflight greift nur bei HTTPS; Fehler schlagen als Redirect-Block mit Reason `tls-preflight-fail` durch.
4. **Test & Observability Hooks**
   - Neue Vitest-Suites (`dns-cache`, `tls-preflight`, `follow-redirects`) abgedeckt.
   - Grafana/Alert Snippets aus DevTalk aufgenommen; noch offene Panels/Alerts siehe "Restaufgaben".
5. **Docs & Tracker**
   - Stabilization-Playbook (MD/YAML) und MandalaMap (MD/JSON/YAML) führen Fraktal111 als abgeschlossen.
   - `codexfeedback/codexfeedback-fraktal111.yaml` + `codexfeedback-latest.*` aktualisiert; Root-Tracker (JSON/YAML/MD) synchronisiert.

## Bewertung der DevTalk-Anforderungen

| DevTalk-Schwerpunkt                        | Status nach Fraktal111                                                                                        | Nächste Schritte                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| CI/CD (Lint, Format, Tests automatisieren) | Läuft in bestehenden Workflows (`pnpm lint:types`, `pnpm test:unit`); Format-Check noch nicht standardisiert. | Evaluate `pnpm lint:format` oder Prettier-Autofix in Husky, README-Badge prüfen.               |
| Code Quality & Maintainability             | DNS/TLS/Redirect Hardening umgesetzt, Docs aktualisiert.                                                      | IPv6/NAT64 Blocklisten, IDNA/CNAME Telemetrie (aus DevTalk 109) vervollständigen.              |
| Observability & Monitoring                 | Neue Counters/Histograms vorhanden, Queries skizziert.                                                        | Grafana Panels/Alerts implementieren (`verify_gate_tls_name_mismatch_total`, Redirect Blocks). |
| AI Governance & Policy                     | OPA erhält `redirect_hops`/`scheme_history`; Ethics UI-Badge für kurze TTLs offen.                            | UI-Badges + Policy-Farbcodierung nachziehen.                                                   |
| Documentation & Onboarding                 | Playbook/MandalaMap/codexfeedback synchronisiert.                                                             | README/Command-Catalog optional mit neuen Counters ergänzen.                                   |
| Testing & Smoke Tests                      | Vitest-Suites ergänzt, Chaos-Szenarien noch pending.                                                          | TTL-Rebind/NAT64 Chaos-Läufe entwerfen (`scripts/chaos`).                                      |

## Restaufgaben / Hooks

- **IPv6/NAT64/Teredo Blocklisten** in `security/ssrf.ts` (DevTalk 109 Punkt 4) + Tests.
- **Grafana & Alerts** für neue Counters (`verify_gate_tls_name_mismatch_total`, `verify_gate_ip_mismatch_total`, Redirect-Block-Reasons) implementieren und ins Playbook einhängen.
- **UI-Badges** für kurze TTLs bzw. Redirect-Historie in `apps/ui` (Ethics Badge).
- **Chaos/Smoke**: TTL-Rebinding + Redirect-Loop Drill, optional Stage env Observability check aus DevTalk.
- **Format/Lint Pipeline**: evaluieren, ob `pnpm lint:format` in CI integriert werden muss.

> Fazit: Fraktal111 erfüllt die unmittelbaren Sicherheits-Hooks aus Aeons Close-out (DNS-Cache, Redirect-Gate, TLS-Preflight). Für die finale Stabilization-Phase bleiben Observability (Grafana/Alerts), IPv6 Edge-Cases und Governance-Badges offen.
