# Codexfeedback – Fraktal 108

- Phase: Verify-Gate SSRF Hardening & DNS Telemetrie
- Status: Verify-Gate resolved jetzt A- und AAAA-Records via `dns.lookup(..., { all: true, verbatim: true })`, entfernt den `[host]`-Fallback,
  blockiert ::1/Private deterministisch und zählt DNS-Fehler (`verify_gate_ssrf_resolve_error_total`, `verify_gate_ssrf_resolve_empty_total`).
  `makePinnedAgent` übernimmt die aufgelöste IP und Vitest deckt AAAA-only Loopback.
- Next Hook: Remote-IP-Validierung/CNAME-Telemetrie evaluieren und die neuen Counter in Grafana/Alertmanager aufnehmen.

What changed

- `apps/verify-gate/src/security/ssrf.ts` nutzt jetzt `dns.lookup(..., { all: true, verbatim: true })`, wirft fail-closed bei DNS-Fehlern,
  liefert resolvierte IPs zurück und zählt Fehler via neue Prometheus-Counter.
- `apps/verify-gate/src/index.ts` konsumiert das neue Ergebnis (`assertAllowed` → IP), entfernt doppelte SSRF-Counter-Inkremente und
  `apps/verify-gate/src/security/agent.ts` pinnt Upstream-Verbindungen mit der aufgelösten IP.
- Neue Tests `apps/verify-gate/src/__tests__/ssrf-aaaa-loopback.test.ts` (AAAA-only ::1) + aktualisierte Allowlist-Suite stellen
  den Fix sicher; Stabilization-Playbook & MandalaMap dokumentieren Fraktal108.

Validate

- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts`
- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-aaaa-loopback.test.ts`
