import fs from "node:fs";
import path from "node:path";
import { heuristicOptimize } from "../src/prompt/coach.ts";

const ROOT = "prompts";
const OUT_OPT = path.join(ROOT, ".optimized");
const OUT_DIFF = path.join(ROOT, ".diff");
fs.mkdirSync(OUT_OPT, { recursive: true });
fs.mkdirSync(OUT_DIFF, { recursive: true });

const exts = [".md", ".yaml", ".yml"];
function* files(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (exts.includes(path.extname(e.name)) && !p.includes("/.optimized/") && !p.includes("/.diff/")) yield p;
  }
}

for (const f of files(ROOT)) {
  const raw = fs.readFileSync(f, "utf8");
  const adv = heuristicOptimize(raw);
  const rel = path.relative(ROOT, f);
  const target = path.join(OUT_OPT, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, adv.optimized);

  const diff = [
    `# Prompt Coach: ${rel}`,
    "## Reasons",
    ...adv.reasons.map(r => `- ${r}`),
    "## Findings",
    ...adv.findings.map(f => `- ${f.type} @ ${f.where}: ${f.note}`)
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIFF, rel.replace(/\.(md|ya?ml)$/, ".md")), diff);
}

console.log("✅ Prompt Coach completed (dry run friendly).");
