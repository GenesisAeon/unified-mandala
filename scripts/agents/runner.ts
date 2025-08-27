#!/usr/bin/env ts-node
import { loadRegistry, loadAgentModule } from "./agent-registry";
import { makeLogger } from "../../agents/_shared/logger";
import { makeRateLimiter } from "../../agents/_shared/rate-limit";
import { makeGuard } from "../../agents/_shared/guardrails";
import { makeHttp } from "../../agents/_shared/http";
import { makeCircuitBreaker } from "../../agents/_shared/circuit-breaker";
import type { Agent } from "../../agents/_shared/types";
import fs from "fs"; import path from "path";

type Args = { id?:string; health?:boolean; healthAll?:boolean; input?:string };
function parseArgs(): Args {
  const a = process.argv.slice(2); const out: any = {};
  for (let i=0;i<a.length;i++){
    const k = a[i];
    if (k === "--id") out.id = a[++i];
    else if (k === "--health") out.health = true;
    else if (k === "--health-all") out.healthAll = true;
    else if (k === "--input") out.input = a[++i];
  } return out;
}

function ensureDir(p:string){ fs.mkdirSync(p, { recursive: true }); }

async function buildCtx(agentId: string) {
  const guard = makeGuard(agentId);
  const logger = makeLogger(agentId);
  const rl = makeRateLimiter(guard.limits.maxQps);
  const http = makeHttp({
    ensureAllowedDomain: guard.ensureAllowedDomain,
    requestTimeoutMs: guard.requestTimeoutMs
  });
  const cb = makeCircuitBreaker({
    failure_threshold: guard.limits.circuit.failure_threshold,
    cooldown_ms: guard.limits.circuit.cooldown_ms
  });
  return {
    logger, rateLimit: rl, http,
    guard: { ensureAllowedDomain: guard.ensureAllowedDomain, consentRequired: guard.consentRequired, requestTimeoutMs: guard.requestTimeoutMs },
    circuit: cb
  };
}

function writeMetric(agentId:string, ok:boolean, durationMs:number, err?:string) {
  const polPath = path.resolve(process.cwd(), "governance/policies/agents-policy.yaml");
  const sink = fs.readFileSync(polPath, "utf8").includes("sink_metrics:")
    ? "data/agents/metrics" : "data/agents/metrics"; // fallback – robust
  const dir = path.resolve(process.cwd(), sink);
  ensureDir(dir);
  const file = path.join(dir, `${agentId}.jsonl`);
  const rec = { ts: new Date().toISOString(), agent: agentId, ok, duration_ms: durationMs, error: err || null };
  fs.appendFileSync(file, JSON.stringify(rec) + "\n");
}

async function main() {
  const args = parseArgs();
  const reg = loadRegistry();

  if (args.healthAll) {
    if (reg.length === 0) { console.log("No agents registered."); process.exit(0); }
    let okAll = true;
    for (const r of reg) {
      try {
        const A = await loadAgentModule(r.entry) as Agent;
        const ctx = await buildCtx(r.id);
        const h = await A.health();
        ctx.logger("info", "health", { ok: h.ok });
        if (!h.ok) okAll = false;
      } catch(e:any) { console.error("health error", r.id, e?.message||e); okAll = false; }
    }
    process.exit(okAll ? 0 : 2);
  }

  if (!args.id) throw new Error("--id ist erforderlich (oder --health-all)");
  const r = reg.find(x=>x.id===args.id);
  if (!r) throw new Error(`agent_not_registered:${args.id}`);

  const A = await loadAgentModule(r.entry) as Agent;
  if (args.health) {
    const h = await A.health();
    console.log(JSON.stringify(h, null, 2));
    process.exit(h.ok ? 0 : 2);
  } else {
    const ctx:any = await buildCtx(A.id || r.id);
    const input = args.input ? JSON.parse(fs.readFileSync(args.input,"utf8")) : {};
    await ctx.rateLimit(); // global tick
    const t0 = Date.now();
    try {
      const out = await ctx.circuit.exec(()=>A.run(input, ctx));
      const dur = Date.now() - t0;
      writeMetric(A.id || r.id, true, dur);
      console.log(JSON.stringify(out, null, 2));
    } catch (e:any) {
      const dur = Date.now() - t0;
      writeMetric(A.id || r.id, false, dur, e?.message || String(e));
      throw e;
    }
  }
}
main().catch(e=>{ console.error(e); process.exit(1); });
