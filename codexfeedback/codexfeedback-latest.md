# Codexfeedback – Fraktal 106

- Phase: Observability & Rotation (Verify-Gate + Ethics-Stack)
- Status: Verify-Gate bündelt Prometheus (`metrics.ts`) mit Countern für Idempotency/SSRF/Token-Fails und Histogram-Latenzen (`method/route/code`), rotiert Verdict-Tokens via `VERIFY_GATE_JWT_SECRETS`/`VERIFY_GATE_JWT_ACTIVE_KID`, und Ethics-API zieht OPA-Bundles (`apps/ethics-api/opa/policy.rego`) per `execFile` ein; Mandala-Playground zeigt EvidenceChips, Chaos-Drill `pnpm chaos:ethics --scenario boundary-down --expect failclosed` hängt im Nightly.
- Next Hook: Grafana-Panels/Alerts für die neuen Verify-Gate-Counter bauen, Secret-Rotation-Runbook dokumentieren und OPA-Bundle-Artefakte/Badges verteilen.

What changed

- `apps/verify-gate/src/metrics.ts` registriert Prometheus-Registry + Counter/Histogram und wird in `apps/verify-gate/src/index.ts` angebunden (Idempotency/SSRF/Token-Fail).
- `apps/verify-gate/src/verdictToken.ts` liest Secret-Mappings (`VERIFY_GATE_JWT_SECRETS`) inkl. Active-KID; Legacy-Secret bleibt Fallback.
- `apps/api/src/middleware/verifyEthics.ts` akzeptiert JWTs per `kid`-basierter Secret-Auswahl, Test `ethics-token-guard.test.ts` prüft Multi-Secret + Header.
- `apps/ethics-api/src/opa.ts` wertet Policies (`apps/ethics-api/opa/policy.rego`) via `execFile('opa', … '--stdin-input')` aus und liefert `evidence_domains_distinct`.
- `apps/ui/src/components/EvidenceChips.tsx` + `MandalaAIPlayground.tsx` zeigen Domain-Diversität/Strong-Badges; Chaos-Skript & Nightly (`scripts/chaos/ethics-chaos.mjs`, `.github/workflows/ci.nightly.yml`) fahren Boundary-Down-Drill.
- Docs & Mappings (`docs/roadmap/v1.0-stabilization-playbook.*`, `MandalaMap.*`, `codexfeedback.*`, `analysis/devtalk106-evaluation.md`) spiegeln Fraktal106.

Validate

- `pnpm -w vitest run apps/verify-gate/src/__tests__/idempotency.test.ts`
- `pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts`
- `pnpm -w vitest run apps/ethics-api/src/__tests__/ethics-failclosed.test.ts`
- `pnpm chaos:ethics --scenario boundary-down --expect failclosed` _(Nightly Drill; lokal optional mit laufendem Stack)_
