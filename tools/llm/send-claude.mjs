import { readFile } from "fs/promises";
import { writeFileSync } from "fs";
import { fetch } from "undici";

const inPath = process.argv[2] || "tools/llm-review-prompts/claude.md";
const outPath = process.argv[3] || "feedback/claude.md";

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY");

const prompt = await readFile(inPath, "utf-8");
const body = {
  model: MODEL,
  max_tokens: 4000,
  messages: [{ role: "user", content: prompt }]
};

const resp = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify(body)
});
if (!resp.ok) {
  const t = await resp.text();
  throw new Error(`Claude API error ${resp.status}: ${t}`);
}
const data = await resp.json();
const text = data?.content?.[0]?.text ?? "";
writeFileSync(outPath, text);
console.log("Claude feedback written:", outPath);
