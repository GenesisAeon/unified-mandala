# Observability

- Logging: `packages/logging/*` (pino + AsyncLocalStorage)
- Request-Logs: `src/middleware/request-logger.ts`
- Health: `/healthz`, `/readyz` (Version, Zeit)
- Event Bus: `packages/bus/` (mitt, optional Redis bridge)
- Locks: `packages/lock/` (Redis bevorzugt, FS-Fallback)

## Env

- `LOG_LEVEL=debug`
- `REDIS_URL=redis://localhost:6379` (optional)

## ALS & Logging

- Steuerung: `LOG_CONTEXT=off` (deaktiviert), `LOG_CONTEXT_SAMPLE=0.25` (25% Sampling)

## Readiness

- `/readyz` prüft Redis, wenn `REDIS_URL` gesetzt ist.

## Locks

- Stale-Cleanup beim Start (älter als 5 Min).

## Event Bus

- `onSafe()` fängt Handler-Fehler ab → `packages/bus/dlq`.

## Verify-Gate Netzwerkmetriken

- `verify_gate_dns_ttl_pinned_seconds_bucket` – Histogram der gepinnten DNS-TTLs; Recording-Rule `p95:verify_gate_dns_ttl_pinned_seconds` liefert den p95-Wert über 5 Minuten.
- `verify_gate_tls_name_mismatch_total` / `verify_gate_ip_mismatch_total` – Counter für TLS-SAN- bzw. Remote-IP-Abweichungen.
- `verify_gate_redirect_block_total{reason}` – Gründe für geblockte Redirects (`ttl-preflight-fail`, `max-hops`, `scheme-mismatch`).

### TTL-Schwellen & Alerting

- Alert **VerifyGateLowDNSTTL** feuert, wenn `p95:verify_gate_dns_ttl_pinned_seconds < 20` für mindestens 15 Minuten bleibt (Hinweis auf Rebinding/volatiles DNS).
- Manuelles PromQL, um aktuelle TTL-P95 zu prüfen:

  ```promql
  histogram_quantile(0.95, sum by (le) (rate(verify_gate_dns_ttl_pinned_seconds_bucket[5m])))
  ```

- Beim Debuggen TTLs < 10 s prüfen (`kubectl logs verify-gate ...` → `x-verify-network` Header) und Ethics-OPA-Inputs (`ttl_sec`) beobachten.
- Alertmanager-Routing: Alerts mit Label `severity=warning` werden an den Verify-Gate Oncall weitergeleitet (siehe `observability/alerts/verify-gate.yaml`).
