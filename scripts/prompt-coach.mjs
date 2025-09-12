import { globby } from "globby";
import fs from "node:fs";
import path from "node:path";
import { heuristicOptimize } from "../src/prompt/coach.ts";

const INPUT_GLOBS = ["prompts/**/*.md", "prompts/**/*.yaml", "prompts/**/*.yml"];
const outOpt = "prompts/.optimized";
const outDiff = "prompts/.diff";

fs.mkdirSync(outOpt, { recursive: true });
fs.mkdirSync(outDiff, { recursive: true });

const files = await globby(INPUT_GLOBS, { gitignore: true });

let exitCode = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const res = heuristicOptimize(raw);

  const rel = path.relative("prompts", file).replaceAll(path.sep, "__");
  const optPath = path.join(outOpt, rel + ".md");
  const diffPath = path.join(outDiff, rel + ".md");

  fs.writeFileSync(optPath, res.optimized, "utf8");

  const beforeAfter = `# Before\n\n${raw}\n\n---\n\n# After\n\n${res.optimized}\n\n---\n\n# Why\n\n- ${res.reasons.join("\n- ")}`;
  fs.writeFileSync(diffPath, beforeAfter, "utf8");

  if (res.findings.length) exitCode = 2; // signal: found issues
}

const dry = process.env.CI === "true";
console.log(dry ? "DRY RUN: Prompt Coach completed." : "Prompt Coach completed.");
process.exit(exitCode);
