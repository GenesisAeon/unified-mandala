# Codexfeedback – Fraktal 114 VerifyGateAudit

- Phase: Verify-Gate Hardening (Audit + OPA Netzsignale)
- Status: Verify-Gate setzt per `requestContext` & `logger.ts` strukturierte Audit-Logs, mappt typed Errors über `recordAndMapError` auf Metriken/HTTP und `/readyz` prüft Allowlist/JWT-Konfiguration. Redirect-Preflight fallbackt bei HEAD-405/501 auf Range-GET, IDNA-Tests sichern punycode-Allowlists. Ethics-API validiert OPA-Payloads (`assertEthicsInput`/`assertNetworkSignals`), normalisiert IPs und erzwingt `ttl_sec`/`tls_san_ok`/`redirect_hops`.
- Next Hook: OPA-Policy & Observability-Doku auf neue Netzfelder erweitern und Monitoring-Profile synchronisieren.

What changed

- `apps/verify-gate/src/app.ts` erhält Audit-Middleware, nutzt `recordAndMapError` im Proxy-Catch, härtet `/readyz` und sendet Netzwerk-Signale (`ttl_sec`, `tls_san_ok`, `redirect_hops`).
- `apps/verify-gate/src/errors-map.ts`, `metrics.ts`, `logger.ts`, `mw/requestContext.ts` und neue Tests (`idna-allowlist.test.ts`, `redirect-fallback.test.ts`) decken Error→Metrics-Mapping, Audit-Logs und Redirect-GET-Fallback ab.
- `apps/verify-gate/src/security/ssrf.ts`, `proxy/followRedirects.ts`, `http/headerForward.ts` erweitern SSRF-Metriken, erlauben Range-GET-Fallback und normalisieren Header-Safelist.
- `apps/ethics-api/src/schemas/opa-input.schema.ts`, `index.ts`, `schemas.ts` + Vitest prüfen OPA-Input-Schema, normalisieren `resolved_ip` und erzwingen Netzsignale.

Validate

- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/redirect-fallback.test.ts
- pending: pnpm -w vitest run apps/verify-gate/src/**tests**/idna-allowlist.test.ts
- pending: pnpm -w vitest run apps/ethics-api/src/**tests**/opa-input.schema.test.ts
- pending: pnpm lint:types
