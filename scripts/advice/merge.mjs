#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yaml from "yaml";

// Placeholder merge script: reads external advice rows from existing JSON
// and produces grouped markdown summary by area.

function loadRows() {
  const p = path.resolve("advancedToDo.json");
  if (!fs.existsSync(p)) return [];
  try {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    if (Array.isArray(j)) return j;
    if (Array.isArray(j.rows)) return j.rows;
    return [];
  } catch {
    return [];
  }
}

function main() {
  const rows = loadRows();
  // Existing logic would write advancedToDo.json and external-fr-bundle.yaml here
  const byArea = rows.reduce((m, r) => {
    (m[r.area] ||= []).push(r);
    return m;
  }, {});
  let md = `# External Advice Summary (grouped by area)\n\n`;
  for (const area of Object.keys(byArea)) {
    const list = byArea[area].slice().sort((a, b) => b._score - a._score);
    md += `## ${area}\n\n`;
    for (const r of list.slice(0, 20)) {
      md += `- **${r.title}** (impact ${r.impact}, risk ${r.risk}, effort ${r.effort}) — ${r.model}\n`;
    }
    md += `\n`;
  }
  const outDir = path.resolve("data/plans");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "advancedToDo.by-area.md"), md);
  console.log("→ wrote data/plans/advancedToDo.by-area.md");
}

main();
