# Codexfeedback – Fraktal 108 Hardening Pack

- Phase: Verify-Gate Hardening Pack (TTL/CNAME/TLS)
- Status: `analysis/devtalk109-evaluation.md` fasst das Hardening-Pack zusammen: TTL-bewusster DNS-Cache mit Keep-Alive ≤ minTTL,
  CNAME-/IDNA-Validierung, TLS-SAN/IP-Abgleich inkl. remoteAddress-Check, Redirect-Gates (≤3 Hops, http/https), IPv6-/NAT64-
  Blocklisten sowie neue Counter `verify_gate_dns_ttl_pinned_seconds_bucket`/`verify_gate_redirect_block_total`/
  `verify_gate_ip_mismatch_total`/`verify_gate_tls_name_mismatch_total` und OPA-Inputs (`resolved_ip`, `cname_chain`, `min_ttl_sec`).
  MandalaMap._, Stabilization-Playbook._ und codexfeedback\* markieren den Follow-up als in progress.
- Next Hook: Resolver/TLS/Redirect-Hooks implementieren, IPv6/NAT64-Checks ergänzen, Vitest-Tabelle + TTL-Rebind-Chaosdrill sowie
  Grafana/Alert-Updates liefern.

What changed

- `analysis/devtalk109-evaluation.md` dokumentiert Scope & Prioritäten für den Hardening Pack.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` führen ein Follow-up für TTL-Pinning, CNAME/IDNA, TLS/IP-Pinning,
  Redirect-Gates, IPv6/NAT64 und neue Metriken/OPA-Inputs auf.
- `MandalaMap.(md|json|yaml)` aktualisieren Meta (Fraktal108) und fügen einen Verify-Gate-Hardening-Follow-up-Eintrag hinzu.
- `codexfeedback.(md|json|yaml)` sowie `codexfeedback/codexfeedback-latest.*` und `codexfeedback-fraktal108-hardening.yaml`
  spiegeln den in-progress-Status.

Validate

- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/ssrf-hardening.spec.ts
- pending: pnpm chaos:ethics --scenario dns-rebind
