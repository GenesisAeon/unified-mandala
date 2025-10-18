# Codexfeedback – Fraktal 104

- Phase: Verify-Gate Idempotency & Ethics Token Guard
- Status: Verify-Gate blockt Duplikate über einen Idempotency-Cache (`VERIFY_GATE_IDEMP_TTL_MS`), signiert Ethics-Verdicts per JWT (`VERIFY_GATE_JWT_SECRET`) und pinnt Upstream-IPs (`makePinnedAgent`); `/readyz` prüft Allowlist + Ethics `/readyz`. `apps/api` schützt `/api/ai/chat` via Middleware `verifyEthics` (428 ohne gültiges `x-ethics-token`). Ethics-API nutzt tldts für PSL-Domains, kennzeichnet starke Evidenz (DOI/arXiv/Gov), erweitert Lifeboat-Regeln (Payment-Scam/Malware/Impersonation), sampelt Logs (`LOG_SAMPLE_GREEN`), liefert `boundary_cache_warm` im `/readyz` und koppelt optional OPA (`ETHICS_OPA_*`). Docs/Env/MandalaMap & DevTalk104 spiegeln den Stand, Chaos-Skript `pnpm chaos:ethics` beschreibt Fail-Closed-Proben.
- Next Hook: OPA-Bundle & CLI in CI integrieren (Artefakte, Smoke), Ethics-UI um Strong-Evidence-Badges & Log-Sampling-Metriken erweitern.

What changed

- `apps/verify-gate/src/index.ts` + neue Module (`src/idempotency.ts`, `src/verdictToken.ts`, `src/security/agent.ts`) – Idempotency-Cache, JWT-Verdict-Token, IP-Pinning, `/readyz`-Ethics-Check.
- `apps/verify-gate/src/http/headerForward.ts`, `src/security/ssrf.ts` – Host-Preservation, Protokoll-Allowlist, Allowlist-Status für Readiness.
- Neue/aktualisierte Tests: `apps/verify-gate/src/__tests__/idempotency.test.ts`, `proxy-headers.test.ts`, `streaming-preserves-headers.test.ts`, `ssrf-allowlist.test.ts` (JWT-Secret Setup).
- `apps/api/src/index.ts` + `middleware/verifyEthics.ts` + `__tests__/ethics-token-guard.test.ts` – Upstream-Gate erzwingt `x-ethics-token`; `tests/api/chat-success.test.ts` signiert Tokens in Supertest.
- `apps/ethics-api/src/index.ts` + neues `src/opa.ts` – PSL-basierte Evidenz, Strong-Flag, Lifeboat-Erweiterung, Log-Sampling, `boundary_cache_warm`, optionales OPA-Fail-Closed.
- `.env.example`, `package.json`, `scripts/chaos/ethics-chaos.mjs`, Stabilization-Playbook (MD/YAML), MandalaMap (MD/JSON/YAML), codexfeedback.\*, `analysis/devtalk104-evaluation.md` aktualisiert.

Validate

- `pnpm vitest run apps/verify-gate/src/__tests__/idempotency.test.ts apps/api/src/__tests__/ethics-token-guard.test.ts tests/api/chat-success.test.ts`
