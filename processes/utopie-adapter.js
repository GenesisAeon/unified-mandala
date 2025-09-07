import fs from "fs";
import path from "path";
const outDir = process.env.OUT_DIR || "runs";
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, "artifacts", "utopia_rows.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
const rows = [
  { source: "utopie_adapter", sigil: "sigil:mobility-2030", value: 0.8, timestamp: new Date().toISOString() }
];
fs.writeFileSync(target, JSON.stringify(rows, null, 2));
console.log("[utopie-adapter] wrote", target);
