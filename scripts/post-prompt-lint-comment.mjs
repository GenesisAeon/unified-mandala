import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const dir = process.argv[2] || "prompts/.diff";
if (!fs.existsSync(dir)) process.exit(0);

const diffs = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
if (!diffs.length) process.exit(0);

const body = [
  "### 🤖 Prompt Coach (dry run)",
  "",
  ...diffs.slice(0, 10).map(f => {
    const p = path.join(dir, f);
    const txt = fs.readFileSync(p, "utf8");
    return `**${f}**\n\n<details><summary>Diff</summary>\n\n\`\`\`diff\n${txt}\n\`\`\`\n</details>`;
  }),
  diffs.length > 10 ? `\n…und ${diffs.length - 10} weitere.` : "",
].join("\n");

async function run() {
  if (!process.env.GITHUB_EVENT_PATH) return;
  const evt = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const pr = evt.pull_request;
  if (!pr) { console.log("Not a PR; skipping comment."); return; }
  const url = pr._links.comments.href;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
  if (!token) { console.log("No token; printing body:\n", body); return; }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `token ${token}", "Content-Type": "application/json" },
    body: JSON.stringify({ body })
  });
  console.log("Comment status:", res.status);
}
run().catch(e => { console.error(e); process.exit(1); });
