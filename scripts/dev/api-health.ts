import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import { logWithContext } from "../../packages/logging/logger";
export async function handleHealth(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const u = new URL(req.url || "", "http://localhost");
  if (u.pathname !== "/healthz" && u.pathname !== "/readyz") return false;
  const log = logWithContext();
  const version = (fs.existsSync("package.json") ? JSON.parse(fs.readFileSync("package.json","utf8")).version : "0.0.0") || "0.0.0";
  const data = { ok: true, service: "unified-mandala", version, ts: new Date().toISOString(), ready: true };
  res.setHeader("Content-Type","application/json; charset=utf-8"); res.end(JSON.stringify(data));
  log.info({ path: u.pathname }, "health");
  return true;
}
