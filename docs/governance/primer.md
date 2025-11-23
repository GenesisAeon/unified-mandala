# Mandala Governance Primer

## Purpose

Operational guardrails for ethics policies, verify-gate, and observability.

## Policy Source of Truth

- **Bundle:** `dist/opa/mandala-ethics-bundle.tar.gz` (+ `.sha256`, `.asc`)
- **Signing:** required on prod (`ETHICS_POLICY_SIGNATURE_REQUIRED=1`, `VERIFY_GATE_REQUIRE_POLICY_SIGNATURE=1`)
- **Status Endpoints:** `/policy/status`, `/readyz` (fail-closed on missing/invalid signature)

## Coverage

- **Gate:** `pnpm opa:cover` (threshold via `OPA_MIN_COVERAGE`, default 0.85)
- **CI:** required check “OPA Policy & Coverage”
- **Dashboard:** `grafana/dashboards/panels/opa-coverage-stat.json`

## Verify-Gate Network Rules (abridged)

- **DNS/SSRF:** A+AAAA resolution, TTL pinning, CNAME hop cap, IDNA → ASCII
- **Redirects:** max 3, scheme `http|https`, preflight every hop
- **TLS:** SNI to original host, SAN required, remote IP pinned
- **Degraded:** `X-Verify-Degraded: 1` → fail-closed

## Rotation & Secrets

- Verdict JWT: `VERIFY_GATE_JWT_SECRETS` map + `VERIFY_GATE_JWT_ACTIVE_KID`
- Runbook: `docs/runbooks/verify-gate-jwt-rotation.md`

## On-call Quick Checks

- OPA: `pnpm opa:test`, `pnpm opa:cover`
- Chaos: `pnpm chaos:verify-dns-rebind`, `pnpm chaos:verify-redirect-loop`
- Metrics: verify-gate dashboards (network-safety, ethics-mini)
