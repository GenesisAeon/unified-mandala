import fs from "node:fs";
import path from "node:path";
import { ConvItem, extractText, findKeywords } from "./util";

const dir = process.argv[2] || "fraktalrun";
const hits: string[][] = [];
let idx = 0;

function loadItems(file: string): ConvItem[] {
  const src = fs.readFileSync(file, "utf8");
  if (file.endsWith(".jsonl")) {
    return src
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .map((l) => JSON.parse(l));
  }
  try {
    const data = JSON.parse(src);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

for (const f of fs.readdirSync(dir)) {
  const full = path.join(dir, f);
  if (!/\.json(l)?$/.test(f)) continue;
  const items = loadItems(full);
  for (const item of items) {
    const text = extractText(item);
    const kws = findKeywords(text);
    if (kws.length) {
      hits.push([
        String(idx++),
        String(item.when ?? ""),
        String(item.author ?? ""),
        String(item.channel ?? ""),
        kws.join(","),
        text.slice(0, 80)
      ]);
    }
  }
}

fs.mkdirSync("out", { recursive: true });
const header = "idx\twhen\tauthor\tchannel\tkeywords\tpreview";
const csv = [header, ...hits.map((r) => r.join("\t"))].join("\n");
fs.writeFileSync("out/personhood_hits.csv", csv);
const md = hits.map((r) => `- ${r[1]} ${r[2]} ${r[4]} — ${r[5]}`).join("\n");
fs.writeFileSync("out/personhood_hits.md", md);
console.log(`wrote ${hits.length} hits`);
