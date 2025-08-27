import fs from "fs"; import path from "path";
type Level = "debug"|"info"|"warn"|"error";
const LOG_DIR = process.env.AGENTS_LOG_DIR || "data/agents/logs";
export function makeLogger(agentId: string) {
  const dir = path.resolve(process.cwd(), LOG_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${agentId}.jsonl`);
  return (level: Level, msg: string, meta: any = {}) => {
    const rec = { ts: new Date().toISOString(), level, agent: agentId, msg, ...meta };
    fs.appendFileSync(file, JSON.stringify(rec) + "\n");
    if (level !== "debug") console.log(`[${level}] ${agentId}: ${msg}`);
  };
}

