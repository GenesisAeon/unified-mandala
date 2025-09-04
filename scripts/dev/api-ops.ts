import os from "os";
import type { IncomingMessage, ServerResponse } from "http";

function pct(n: number, d: number) { return d > 0 ? +((n / d) * 100).toFixed(1) : 0; }

async function sampleCpu(ms = 120): Promise<number> {
  // Grobe Prozess-CPU in % (kurzer Sample). Auf Windows ist loadavg=0 – daher Prozess-CPU.
  const a = process.cpuUsage();
  const t0 = process.hrtime.bigint();
  await new Promise(r => setTimeout(r, ms));
  const b = process.cpuUsage();
  const dtUser = b.user - a.user;   // µs
  const dtSys  = b.system - a.system;
  const dt = Number(process.hrtime.bigint() - t0) / 1000; // µs
  const cores = os.cpus()?.length || 1;
  const usage = (dtUser + dtSys) / (dt * cores); // Anteil pro Core
  return Math.min(100, Math.max(0, +(usage * 100).toFixed(1)));
}

export async function handleOps(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url || "", "http://localhost");
  if (url.pathname !== "/api/ops/health") return false;

  const mem = process.memoryUsage();
  const total = os.totalmem();
  const free  = os.freemem();
  const cpuProc = await sampleCpu(100);
  const memSysPct = 100 - pct(free, total);
  const memProcMb = +(mem.rss / (1024 * 1024)).toFixed(1);

  // einfache Heuristik für Drossel-Empfehlung
  let advice: "normal" | "degrade" | "pause" = "normal";
  if (cpuProc > 80 || memSysPct > 85) advice = "degrade";
  if (cpuProc > 92 || memSysPct > 92) advice = "pause";

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(
    JSON.stringify({
      ok: true,
      data: {
        cpu_process_pct: cpuProc,
        mem_system_pct: +memSysPct.toFixed(1),
        mem_process_mb: memProcMb,
        cores: os.cpus()?.length || 1,
        uptime_s: Math.floor(process.uptime()),
        advice
      }
    })
  );
  return true;
}
