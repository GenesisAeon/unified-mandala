# DevTalk 109 – Verify-Gate Hardening Pack Assessment

## Kontext

- Quelle: `DevTalk.txt` + Aeon Post-Merge Hardening Pack (Fraktal108 Follow-up).
- Ziel: Prüfen, welche Low-Effort/High-Payoff-Maßnahmen wir nach dem AAAA-SSRF-Fix adressieren sollten.
- Fokusbereiche: DNS-Pinning, Redirect-Sicherheit, TLS/IP-Checks, IPv6-Edge-Cases, Streaming/Hop-by-Hop, Policy/Telemetry.

## Bewertung der vorgeschlagenen Maßnahmen

1. **DNS-Rebinding & TTL-Pinning**
   - Aktueller Stand: Resolver nutzt `dns.lookup(..., { all: true, verbatim: true })`, aber Keep-Alive-Verbindungen leben unbegrenzt.
   - Bedarf: Cache der Resolvergebnisse inkl. `minTTL`; Keep-Alive pro Host auf TTL begrenzen; Redirect-Hops erneut prüfen.
2. **CNAME-Ketten & IDNA**
   - Aktueller Stand: Keine explizite CNAME/IDNA-Validierung.
   - Bedarf: CNAME-Kette (max 5 Hops) verfolgen, `punycode`-Dekodierung pro Label, Allowlist je Hop auswerten, Telemetrie `verify_gate_ssrf_cname_hops_total`.
3. **TLS & Remote-IP-Pinning**
   - Aktueller Stand: Upstream-Agent pinned IP beim Connect, prüft aber SAN nicht aktiv gegen Host.
   - Bedarf: TLS-Verbindung mit `servername` setzen, SAN gegen `host` validieren; nach Connect `socket.remoteAddress` mit gepinntem IP vergleichen.
4. **IPv6 Edge-Ranges**
   - Aktueller Stand: Private Check deckt `::1` & klassische Bereiche; NAT64/6to4/Teredo/IPv6-mapped IPv4 fehlen.
   - Bedarf: `ipaddr.js`-Gestützte Prüfung für NAT64 (`64:ff9b::/96`), 6to4 (`2002::/16`), Teredo (`2001::/32`), ULA (`fc00::/7`), IPv6-mapped IPv4 (`::ffff:`).
5. **Hop-by-Hop & Streaming Controls**
   - Aktueller Stand: Header-Safelist aktiv, aber `connection`/`keep-alive`/`proxy-*` sollten vor Weiterleitung entfernt werden; Streaming nutzt `fetch` ohne Backpressure-Limits.
   - Bedarf: Hop-by-Hop-Header strikt entfernen, `AbortController` + Timeout für Streams, Body-Größe und Laufzeit deckeln.
6. **Redirect- & Scheme-Guards**
   - Aktueller Stand: Redirects werden nicht begrenzt oder erneut allowlisted.
   - Bedarf: Max. 3 Redirects, nur `http`/`https`, keine Credentials in URLs, Host pro Hop validieren.
7. **Signals & Metriken**
   - Bedarf: Counter/Histogramme für DNS-TTL, Redirect-Blocks, IP-Mismatch, TLS-Namen. Grafana/Alertmanager-Integration erweitern.
8. **Policy Hooks (OPA)**
   - Bedarf: OPA-Eingaben um `resolved_ip`, `cname_chain`, `is_private`, `min_ttl_sec` erweitern; Policies für niedrige TTLs/private Ziele.
9. **Tests & Chaos**
   - Bedarf: Vitest-Matrix für IPv6/NAT64/CNAME/Redirect/TLS-Mismatch; Chaos-Drill für TTL-Rebinding & Redirect-Szenarien.

## Empfohlene nächste Schritte

- `apps/verify-gate/src/security/ssrf.ts`
  - Resolver um TTL-/CNAME-Kette + IDNA validierung ergänzen.
  - DNS-Cache + Keep-Alive TTL-Cap implementieren.
  - IPv6-Private-Check mit `ipaddr.js` erweitern.
- `apps/verify-gate/src/security/agent.ts`
  - TLS `servername` setzen, SAN prüfen, `remoteAddress` nach `connect` vergleichen.
  - Hop-by-Hop-Header (connection/keep-alive/te/proxy-\*) verwerfen, Streaming mit `AbortController` absichern.
- `apps/verify-gate/src/index.ts`
  - Redirect-Limits & Scheme-Guards implementieren.
  - Body-/Zeit-Limits für Streams konfigurieren.
- Telemetrie & Policy
- `apps/verify-gate/src/metrics.ts`: zusätzliche Counter/Histogramme (`verify_gate_dns_ttl_pinned_seconds_bucket`, `verify_gate_redirect_block_total`, `verify_gate_ip_mismatch_total`, `verify_gate_tls_name_mismatch_total`).
  - `apps/ethics-api/opa/policy.rego`: neue Inputs konsumieren, private Ziele/kurze TTLs ablehnen.
- Tests & Docs
  - Neue Vitest-Suite `apps/verify-gate/src/__tests__/ssrf-hardening.spec.ts` (table-driven, NAT64, CNAME, Redirect, TTL-Rebind via Fake Timers).
  - Chaos-Skript-Erweiterung (`scripts/chaos/ethics-chaos.mjs` oder neues `dns-rebind` Szenario).
  - Dokumentation & Runbooks in `docs/roadmap/v1.0-stabilization-playbook.*`, `MandalaMap.*`, `codexfeedback*` aktualisieren.

## Hook / Tracking

- Fraktalstatus: **Fraktal108 Hardening Pack** → _in progress_.
- Empfohlene Tracking-Einträge:
  - `codexfeedback-fraktal108-hardening.yaml`: Status, Deliverables, Tests.
  - MandalaMap Follow-up: Verify-Gate Hardening (TTL, CNAME, Redirect, TLS, Metrics, OPA).
  - Roadmap: Abschnitt 1 (Stabilität) & Abschnitt 7 (Observability) um Hardening Pack ergänzen.

> Fazit: Der Hardening Pack adressiert realistische SSRF-Angriffsvektoren (DNS-Rebinding, CNAME, IPv6 Edge). Aufwand moderat, hoher Sicherheitsgewinn. Umsetzung sollte zeitnah erfolgen, bevor weitere Services auf Verify-Gate vertrauen.
