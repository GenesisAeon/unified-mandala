import fs from "fs";
const p = "policies/personhood-levels.json";
if (!fs.existsSync(p)) { console.error("Missing policies/personhood-levels.json"); process.exit(1); }
const doc = JSON.parse(fs.readFileSync(p,"utf-8"));
if (!Array.isArray(doc.gates)) { console.error("gates[] missing in policies/personhood-levels.json"); process.exit(1); }
const topics = new Set();
for (const g of doc.gates) {
  if (!g.topic || !g.min_level) { console.error("gate missing topic/min_level", g); process.exit(1); }
  if (topics.has(g.topic)) { console.error("duplicate gate topic:", g.topic); process.exit(1); }
  topics.add(g.topic);
}
console.log("Governance policy looks sane.");
