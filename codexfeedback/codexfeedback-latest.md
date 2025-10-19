# Codexfeedback – Fraktal 106

- Phase: Observability & Rotation (Verify-Gate + Ethics-Stack)
- Status: Verify-Gate persistiert Idempotency-Keys via `apps/verify-gate/src/idempotency/store.ts` (`better-sqlite3`, `VERIFY_GATE_IDEMP_DB`, TTL `VERIFY_GATE_IDEMP_TTL_MS`), Safelistet Header (authorization/cookie/user-agent/accept/accept-language/content-type/x-request-id/x-forwarded-for/x-forwarded-proto/x-ethics-token) und propagiert `X-Verify-Degraded` bis UI (`fetchJsonWithEthics`, `MandalaAIPlayground` Fail-closed-Banner). Verdict-Tokens rotieren via `VERIFY_GATE_JWT_SECRETS`/`VERIFY_GATE_JWT_ACTIVE_KID`, Runbook `docs/runbooks/verify-gate-jwt-rotation.md` + `ethics-token-guard.test.ts` decken Legacy/Drop ab, `apps/ethics-api/opa/policy.rego` verlangt starke Evidenz und verweigert bei `input.degraded == true`; Chaos-Drill `pnpm chaos:ethics --scenario boundary-down --expect failclosed` läuft nightly. Grafana bündelt die Verify-Gate-Metriken (`grafana/dashboards/verify-gate-ethics-mini.json`) und Prometheus-Alerts (`observability/alerts/verify-gate.yaml`) melden Replay-/SSRF-/Token-Spitzen.
- Next Hook: Alert-Routing (Alertmanager/Webhook) dokumentieren, OPA-Bundle-Artefakte + Badges in CI verteilen und optionalen UI-Filter („Strong only“) ausrollen.

What changed

- `apps/verify-gate/src/metrics.ts` registriert Prometheus-Registry + Counter/Histogram und wird in `apps/verify-gate/src/index.ts` angebunden (Idempotency/SSRF/Token-Fail).
- `apps/verify-gate/src/verdictToken.ts` liest Secret-Mappings (`VERIFY_GATE_JWT_SECRETS`) inkl. Active-KID; Legacy-Secret bleibt Fallback.
- `apps/api/src/middleware/verifyEthics.ts` akzeptiert JWTs per `kid`-basierter Secret-Auswahl, Test `ethics-token-guard.test.ts` prüft Multi-Secret + Header.
- `apps/ethics-api/src/opa.ts` wertet Policies (`apps/ethics-api/opa/policy.rego`) via `execFile('opa', … '--stdin-input')` aus und liefert `evidence_domains_distinct`.
- `apps/ui/src/components/EvidenceChips.tsx` + `MandalaAIPlayground.tsx` zeigen Domain-Diversität/Strong-Badges; Chaos-Skript & Nightly (`scripts/chaos/ethics-chaos.mjs`, `.github/workflows/ci.nightly.yml`) fahren Boundary-Down-Drill.
- Grafana-Minidashboard `grafana/dashboards/verify-gate-ethics-mini.json` & Prometheus-Alerts `observability/alerts/verify-gate.yaml` visualisieren Idempotency/SSRF/Token-Fails, Upstream-p95 und Ethics-Degradierungen; MandalaMap./docs verlinken das Bundle.
- Docs & Mappings (`docs/roadmap/v1.0-stabilization-playbook.*`, `MandalaMap.*`, `codexfeedback.*`, `analysis/devtalk106-evaluation.md`) spiegeln Fraktal106.

Validate

- `pnpm -w vitest run apps/verify-gate/src/__tests__/idempotency.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm chaos:ethics --scenario boundary-down --expect failclosed` _(Nightly Drill; lokal optional mit laufendem Stack)_
