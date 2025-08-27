# Agents · Phase A (Registry + Guardrails)

## Ziel
Nicht-invasiver Rahmen für bestehende/neue Agenten: Registry, Governance-Policy, Logger, Rate-Limit, Circuit-Breaker, Retry, HTTP-Client, Runner & Smoke.

## Opt-in (Bestehenden Agent registrieren)
1) Eintrag in `agents/registry.yaml`:
   ```yaml
   agents:
     - id: "hydro.cso"
       entry: "agents/hydro.cso/index.ts"
       description: "CSO-Regelungsagent (Shadow→AB)"
   ```
2) Agent-Modul exportiert `id`, `health()`, `run(input, ctx)`:
   ```ts
   import type { Agent } from "../_shared/types";
   const agent: Agent<any, any> = {
     id: "hydro.cso",
     async health() { return { id: "hydro.cso", ok: true }; },
     async run(input, ctx) {
       ctx.logger("info", "starting", { input });
       await ctx.rateLimit();
       // Beispiel-Call mit Guardrails:
       // const res = await ctx.http("https://pegelonline.wsv.de/api/...");
       return { ok: true, echo: input };
     }
   };
   export default agent;
   ```
3) Health testen:
   ```bash
   pnpm agents:health
   pnpm agents:run -- --id hydro.cso --input ./example.json
   ```

## Policies/Guardrails
- `governance/policies/agents-policy.yaml` → globale Limits & Domain-Whitelist
- Pro Agent Override unter `agents:` möglich
- Consent-Flag (falls menschliche Bestätigung nötig)

## Logs/Metrics
- JSONL unter `data/agents/logs/<agent>.jsonl`
- (Phase B) Prom-Metriken/Histo; (Phase C) OpenTelemetry

## Smoke
- `pnpm smoke:agents` → lädt Registry, ruft `health()` auf; leerer Registry ⇒ OK (0)

