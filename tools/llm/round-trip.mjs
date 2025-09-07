import { spawnSync } from "child_process";
import { mkdirSync } from "fs";

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env } });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

mkdirSync("feedback", { recursive: true });

// 1) Prompts senden
run("node", ["tools/llm/send-claude.mjs", "tools/llm-review-prompts/claude.md", "feedback/claude.md"]);
run("node", ["tools/llm/send-mistral.mjs", "tools/llm-review-prompts/mistral.md", "feedback/mistral.md"]);

// 2) Aggregieren + planen
run("node", ["tools/feedback/ingest.mjs", "feedback/claude.md", "feedback/mistral.md"], { });
run("node", ["tools/feedback/plan.mjs", "feedback/aggregated.json"]);

// 3) Risk-aware apply
run("node", ["tools/feedback/apply2.mjs", "CHANGESET.yaml"]);

// 4) Smokes
run("node", ["tools/bus-smoke.ts"]);
run("node", ["tools/governance-check.mjs"]);

// 5) Release Notes
run("node", ["tools/release/notes2.mjs"]);

console.log("✅ Round-trip completed.");
