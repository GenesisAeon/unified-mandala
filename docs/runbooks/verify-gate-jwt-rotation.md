# Verify-Gate JWT Rotation Runbook

This runbook explains how to rotate the HMAC secrets used by `apps/verify-gate` to sign `x-ethics-token` verdicts. The gate reads the active signing key from `VERIFY_GATE_JWT_ACTIVE_KID` and exposes all allowed verification keys via `VERIFY_GATE_JWT_SECRETS`.

## When to run this

- A signing secret is older than 30 days or leaked in an incident.
- You are rolling new secrets prior to a production deployment.
- Governance requires a periodic rotation check (Fraktal106 hardening).

## Prerequisites

- Access to the environment that hosts verify-gate and the upstream API.
- Ability to edit the environment configuration (Kubernetes secret, `.env`, Vault entry, etc.).
- `openssl` (or another strong entropy source) available locally.

## Rotation steps

1. **Generate the new secret**

   ```bash
   NEW_SECRET=$(openssl rand -base64 32 | tr -d '\n')
   echo "New secret (kidB): $NEW_SECRET"
   ```

   Use a unique `kid` label (e.g. `kidB`, `kid2025Q1`).

2. **Publish the secret map**

   Append the new key to `VERIFY_GATE_JWT_SECRETS` alongside the current key:

   ```bash
   # .env, helm values, or secret manager payload
   VERIFY_GATE_JWT_SECRETS="kidA:$(printf '%s' "$OLD_SECRET" | base64),kidB:$NEW_SECRET"
   VERIFY_GATE_JWT_ACTIVE_KID="kidB"
   ```

   `VERIFY_GATE_JWT_ACTIVE_KID` tells verify-gate which key to use for signing. Upstream services accept every `kid` listed in `VERIFY_GATE_JWT_SECRETS`.

3. **Deploy verify-gate + upstream API**
   - Restart/redeploy verify-gate with the updated environment variables.
   - Restart the API (or any service using `apps/api/src/middleware/verifyEthics.ts`) so it can read the new secret list.

4. **Smoke test**

   ```bash
   pnpm -w vitest run apps/api/src/__tests__/ethics-token-guard.test.ts
   pnpm -w vitest run apps/verify-gate/src/__tests__/idempotency.test.ts
   ```

   Optionally hit the deployed stack:

   ```bash
   curl -s -X POST \
     -H "content-type: application/json" \
     -H "idempotency-key: test-$(date +%s)" \
     --data '{"messages":[{"role":"user","content":"ping"}]}' \
     https://verify.example.com/gate/api/ai/chat
   ```

5. **Remove the legacy key**

   After verifying the rollout, remove the old key from `VERIFY_GATE_JWT_SECRETS` and redeploy. Requests signed with the retired `kid` now fail with `428 ethics_verification_failed`, as covered by `apps/api/src/__tests__/ethics-token-guard.test.ts`.

## Related knobs

- `VERIFY_GATE_JWT_SECRETS` – comma-separated `kid:base64Secret` map.
- `VERIFY_GATE_JWT_ACTIVE_KID` – active signing kid.
- `VERIFY_GATE_JWT_SECRET` – legacy single-secret fallback (kept for migrations; prefer the map).

## References

- `apps/verify-gate/src/verdictToken.ts`
- `apps/api/src/middleware/verifyEthics.ts`
- `docs/roadmap/v1.0-stabilization-playbook.md` (Fraktal106)
