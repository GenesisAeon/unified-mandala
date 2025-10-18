# Codexfeedback – Fraktal 105

- Phase: Verify-Gate Test Hardening & DevTalk105 Hooks
- Status: Vitest aliasiert `@opentelemetry/api` auf einen No-Op-Stub, `tests/setup/ci.ts` setzt Loopback-Allowlists für Verify-Gate, SSRF-Gate akzeptiert Wildcards und Upstream `verifyEthics` toleriert Clock-Skew (HS256).
- Next Hook: Prometheus-Counter (Idempotency/SSRF/Token-Failures) + Grafana-Alerts ergänzen und OPA-Bundle/CLI in CI verteilen.

What changed

- `vitest.config.ts` (Alias + Inline-Regeln für `@opentelemetry/api`).
- Neues Stub-Modul `tests/__mocks__/otel-api.ts`.
- `tests/setup/ci.ts` setzt Loopback-Allowlist (`VERIFY_GATE_SSRF_ALLOWLIST`, `VERIFY_GATE_ALLOW_PROTOCOLS`).
- `apps/verify-gate/src/security/ssrf.ts` akzeptiert `VERIFY_GATE_SSRF_ALLOWLIST` mit Protokoll-/Port-Wildcards; Test `ssrf-allowlist.test.ts` prüft Wildcards.
- `apps/api/src/middleware/verifyEthics.ts` erzwingt `algorithms: ['HS256']` + `clockTolerance: 5`.
- Stabilization-Playbook (MD/YAML), MandalaMap (MD/JSON/YAML) und codexfeedback.\* spiegeln den Lauf.
- `analysis/devtalk105-evaluation.md` dokumentiert den DevTalk-Abgleich.

Validate

- `pnpm -w vitest run apps/verify-gate/src/__tests__/ssrf-allowlist.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run tests/api/chat-success.test.ts`
