import fs from "fs";
import YAML from "yaml";

const cfgPath = "policies/merge-guardrails.yaml";
if (!fs.existsSync(cfgPath)) {
  console.log("No merge-guardrails.yaml — skipping");
  process.exit(0);
}
const cfg = YAML.parse(fs.readFileSync(cfgPath, "utf-8"));
let ok = true;

function fileTouched(path) {
  try {
    const out = require("child_process").execSync(`git diff --name-only HEAD~1..HEAD`, { encoding: "utf-8" });
    return out.split("\n").filter(Boolean).includes(path);
  } catch { return false; }
}

for (const rule of cfg.rules || []) {
  if (rule.id === "no-gate-widening-without-issue") {
    const files = rule.check?.files || [];
    for (const f of files) {
      if (!fileTouched(f)) continue;
      const txt = fs.readFileSync(f, "utf-8");
      if ((rule.check.pattern_disallow || []).some(p => txt.includes(p))) {
        if (rule.check.require_issue_ref) {
          const msg = require("child_process").execSync(`git log -1 --pretty=%B`, { encoding: "utf-8" });
          if (!/#\d+/.test(msg)) {
            ok = false;
            console.error(`[Guardrail] ${rule.id}: Disallowed pattern in ${f} without issue reference.`);
          }
        }
      }
    }
  }
  if (rule.id === "docs-for-governance-changes") {
    const touchedPolicy = fileTouched("policies/personhood-levels.yaml") || fileTouched("policies/personhood-levels.json");
    if (touchedPolicy) {
      const touchedDocs = ["docs/","README.md","Handbuch.md"].some(p => fileTouched(p) || p.endsWith(".md") && fileTouched(p));
      if (!touchedDocs) {
        ok = false;
        console.error("[Guardrail] docs-for-governance-changes: Policy change requires doc patch.");
      }
    }
  }
}

process.exit(ok ? 0 : 1);
