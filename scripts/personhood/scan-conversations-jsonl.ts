import fs from "node:fs";
import path from "node:path";
import { ConvItem, extractText, findKeywords } from "./util";

const dir = process.argv[2] || "fraktalrun";
const hits: any[] = [];
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
      hits.push({
        idx: idx++,
        when: item.when ?? "",
        author: item.author ?? "",
        channel: item.channel ?? "",
        keywords: kws.join(","),
        preview: text.slice(0, 80)
      });
    }
  }
}

fs.mkdirSync("out", { recursive: true });
fs.writeFileSync(
  "out/personhood_hits.jsonl",
  hits.map((h) => JSON.stringify(h)).join("\n")
);
console.log(`wrote ${hits.length} hits`);
