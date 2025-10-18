# Codexfeedback – Fraktal 103

- Phase: Verify-Gate Defense-in-Depth & Ethics Degraded Mode
- Status: Verify-Gate säubert Header (Drop-Liste), prüft DNS-Allowlists (`VERIFY_GATE_UPSTREAM_ALLOWLIST`), exportiert Prometheus (`verify_gate_inflight`, `verify_gate_upstream_duration_ms`, `verify_gate_http_responses_total`) inkl. `/metrics`; Ethics-API sendet `x-ethics-degraded`, nutzt Lifeboat-Regeln & Evidenz-Dedupe (`ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS`) und zählt Decisions (`ethics_decision_log_total`). Docs/Env/MandalaMap spiegeln den Lauf, DevTalk103 notiert Hooks.
- Next Hook: Grafana-Alerts für neue Verify/Ethics-Metriken und DOI/Handle-Validator für Evidenz-Stärke.

What changed

- `apps/verify-gate/src/index.ts` + neue Module `http/headerForward.ts`, `security/ssrf.ts` – Header-Sanitizing, DNS-SSRF-Allowlist, Prometheus-Middleware, `/metrics`, Abort-aware Streaming; Tests decken Proxy, Streaming & Allowlist ab.
- `apps/ethics-api/src/index.ts` – Degraded-Signal (`x-ethics-degraded`, Counter `ethics_degraded_total`), Lifeboat-Regeln (Hate/PII/Scam), Boundary-Cache (`ETHICS_CACHE_TTL_MS`), Trace-Forwarding, Evidenz-Dedupe (`ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS`), Counters `ethics_decision_log_total`/`ethics_evidence_domains_total`; Failclosed-Test erweitert.
- `.env.example`, Stabilization-Playbook (MD/YAML), MandalaMap (MD/JSON/YAML), `analysis/devtalk103-evaluation.md`, codexfeedback.\* aktualisiert (neue Env-Variablen, Defense-in-Depth Status, Hooks).

Validate

- `pnpm vitest run apps/verify-gate/src/__tests__/proxy-headers.test.ts apps/verify-gate/src/__tests__/streaming-preserves-headers.test.ts apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
