import type { IncomingMessage, ServerResponse } from "http";
import { temperatureToSigil, wildfireToSigil, groundwaterToSigil } from "../../src/adapters/sigil-mapping";
import { calculateResonance, resonanceToSigil } from "../../packages/crep/resonance";
import type { SigilMessage } from "../../packages/sigil/protocols";

const ring: SigilMessage[] = [];
const MAX = 256;
function recordSigil(s: SigilMessage) {
  ring.push(s);
  if (ring.length > MAX) ring.splice(0, ring.length - MAX);
}

function ok(res: ServerResponse, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: true, data }));
}
function nf(res: ServerResponse) { res.statusCode = 404; ok(res, { error: "not_found" }); }

export async function handleKpi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const u = new URL(req.url || "", "http://localhost");
  if (!u.pathname.startsWith("/api/kpi/")) return false;
  const id = u.pathname.split("/").pop();

  if (id === "t2m_anomaly") {
    // simple mock: 12 + sin()*3 == T, baseline 14.5
    const c = 12 + Math.sin(Date.now()/3600e3*6)*3;
    const value = +(c - 14.5).toFixed(2);
    const sig = temperatureToSigil(c);
    (globalThis as any).__LAST_T2M_ANOMALY_SIGIL__ = sig.symbol;
    recordSigil(sig);
    ok(res, { id, value, unit: "°C", sigil: sig.symbol });
    return true;
  }

  if (id === "wildfire_risk") {
    const c = 12 + Math.sin(Date.now()/3600e3*6)*3;
    const idx = Math.max(0, Math.min(1, ((c-14.5)-0)/4));
    const sig = wildfireToSigil(idx);
    (globalThis as any).__LAST_WILDFIRE_RISK_SIGIL__ = sig.symbol;
    recordSigil(sig);
    ok(res, { id, value: +idx.toFixed(2), unit: "index", sigil: sig.symbol });
    return true;
  }

  if (id === "underground_water") {
    const last = 300 + Math.sin(Date.now()/6e5)*4;
    const delta = +(last - 300).toFixed(1);
    const sig = groundwaterToSigil(delta);
    (globalThis as any).__LAST_UNDERGROUND_WATER_SIGIL__ = sig.symbol;
    recordSigil(sig);
    ok(res, { id, value: delta, unit: "cm", sigil: sig.symbol });
    return true;
  }

  nf(res);
  return true;
}

export async function handleCrep(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const u = new URL(req.url || "", "http://localhost");
  if (u.pathname !== "/api/crep/resonance") return false;
  const r = calculateResonance(ring);
  const sig = resonanceToSigil(r);
  (globalThis as any).__LAST_CREP_RESONANCE_SIGIL__ = sig;
  ok(res, { value: r, unit: "index", sigil: sig, n: ring.length });
  return true;
}
