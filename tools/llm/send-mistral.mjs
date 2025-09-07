import { readFile } from "fs/promises";
import { writeFileSync } from "fs";
import { fetch } from "undici";

const inPath = process.argv[2] || "tools/llm-review-prompts/mistral.md";
const outPath = process.argv[3] || "feedback/mistral.md";

const API_KEY = process.env.MISTRAL_API_KEY;
const MODEL = process.env.MISTRAL_MODEL || "mistral-large-latest";
if (!API_KEY) throw new Error("Set MISTRAL_API_KEY");

const prompt = await readFile(inPath, "utf-8");
const body = {
  model: MODEL,
  messages: [{ role: "user", content: prompt }],
  temperature: 0.2,
  max_tokens: 4000
};

const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "authorization": `Bearer ${API_KEY}`
  },
  body: JSON.stringify(body)
});
if (!resp.ok) {
  const t = await resp.text();
  throw new Error(`Mistral API error ${resp.status}: ${t}`);
}
const data = await resp.json();
const text = data?.choices?.[0]?.message?.content ?? "";
writeFileSync(outPath, text);
console.log("Mistral feedback written:", outPath);
