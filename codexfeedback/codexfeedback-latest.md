# Codexfeedback – Fraktal 111 Redirect/TLS Close-out

- Phase: Verify-Gate Hardening Pack (TTL/CNAME/TLS)
- Status: Jitterned DNS-TTL-Cache mit Request-Coalescing, TLS/SAN-Preflight auf gepinnter IP und streng validierte Redirect-Ketten (IP-gepinnte HEADs, Allowlist vor jedem Hop) sind implementiert. Neue Tests decken Cache, TLS- und Redirect-Guards ab; netContext trägt redirect_hops/scheme_history und Prometheus exportiert TLS/IP-Mismatch- sowie Redirect-Block-Metriken. Stabilization-Playbook & MandalaMap markieren Fraktal111 als abgeschlossen.
- Next Hook: IPv6/NAT64-Blocklisten und Redirect-Metrik-Panels finalisieren, OPA/UI-Badges für kurze TTLs & redirect_hops ergänzen.

What changed

- `apps/verify-gate/src/security/dnsCache.ts` implementiert den jitternden DNS-Cache inkl. purge scheduler; `security/ssrf.ts` nutzt ihn.
- `apps/verify-gate/src/security/tlsPreflight.ts` + `src/index.ts` erzwingen TLS/SAN-Preflight und Mismatch-Metriken; Redirects laufen über IP-gepinnte HEADs (`proxy/followRedirects.ts`).
- `apps/verify-gate/src/__tests__/(dns-cache|tls-preflight|follow-redirects).test.ts` sichern Cache-Coalescing, TLS-Timeout/SAN-Pfade und Redirect-Guards.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` sowie `MandalaMap.(md|json|yaml)` vermerken den Fraktal111-Abschluss; `codexfeedback-fraktal111.yaml` trackt den Stand.

Validate

- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/dns-cache.test.ts
- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/tls-preflight.test.ts
- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/follow-redirects.test.ts
