import fs from "fs";
const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error("usage: node tools/feedback/ingest.mjs feedback/claude.md feedback/mistral.md");
  process.exit(1);
}
function parseBlocks(md) {
  const blocks = [];
  const fence = /```(\w+)(?:\s+title=([^\n]+))?\n([\s\S]*?)```/g;
  let m;
  while ((m = fence.exec(md))) {
    blocks.push({ lang: m[1], title: m[2] || "", content: m[3] });
  }
  return blocks;
}
function splitSections(md) {
  const out = {};
  const re = /^##\s+([A-Z\/]+)\s*$/gmi;
  let last = "ROOT", idx = 0, match, prevIndex = 0;
  const sections = [];
  const lines = md.split(/\r?\n/);
  for (let i=0;i<lines.length;i++) {
    const L = lines[i];
    const m = /^##\s+([A-Z\/]+)\s*$/.exec(L);
    if (m) {
      sections.push({ name: m[1], start: i });
    }
  }
  sections.push({ name: "EOF", start: lines.length });
  for (let i=0;i<sections.length-1;i++) {
    const s = sections[i], e = sections[i+1];
    const body = lines.slice(s.start+1, e.start).join("\n");
    out[s.name] = body;
  }
  return out;
}
const aggregated = [];
for (const p of inputs) {
  const md = fs.readFileSync(p, "utf-8");
  const sections = splitSections(md);
  const blocks = parseBlocks(md);
  aggregated.push({ file: p, sections, blocks });
}
process.stdout.write(JSON.stringify(aggregated, null, 2));
