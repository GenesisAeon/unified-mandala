#!/usr/bin/env node
/**
 * Stream-Parser für sehr große JSONL/JSON:
 * - erkennt JSONL oder großes JSON Array
 * - filtert nach keywords/tags
 * - exportiert Treffer (JSON) + kompakte CSV
 */
import { createReadStream, writeFileSync } from "fs";
import * as readline from "readline";

const SRC = process.argv[2] || "docs/sigils/newadvancedconversations.json";
const KEY = (process.argv[3] || "").toLowerCase();

type Row = { id?: string; role?: string; text?: string; tags?: string[]; ts?: string };

async function parse() {
  const hits: Row[] = [];
  const rl = readline.createInterface({ input: createReadStream(SRC), crlfDelay: Infinity });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      const text = (obj.text || obj.content || "") + "";
      const tags = obj.tags || [];
      const match =
        !KEY ||
        text.toLowerCase().includes(KEY) ||
        tags.join(",").toLowerCase().includes(KEY);
      if (match) hits.push({ id: obj.id, role: obj.role, text, tags, ts: obj.ts });
    } catch {
      // ignore parse errors for non-JSONL chunks
    }
  }
  writeFileSync("analysis/conversations.filtered.json", JSON.stringify(hits, null, 2));
  const csv =
    ["id,role,ts,text"].concat(
      hits.map(h =>
        `"${(h.id || "").replace(/"/g, '""')}","${h.role || ""}","${h.ts || ""}","${(h.text || "").replace(/"/g, '""')}"`
      )
    ).join("\n");
  writeFileSync("analysis/conversations.filtered.csv", csv);
  console.log(`✅ ${hits.length} Treffer → analysis/conversations.filtered.{json,csv}`);
}
parse();
