#!/usr/bin/env node
/**
 * UI/VR Audit: listet React-Komponenten (TSX) + rudimentäre Props-Signaturen,
 * VR-Schlüsseldateien und markiert TODO/Placeholder.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const map = JSON.parse(readFileSync(join(process.cwd(), "analysis/repo-map.json"), "utf8")) as {
  path: string;
  type: string;
}[];
const ui = map.filter(x => x.type === "ui" && x.path.endsWith(".tsx"));
const vr = map.filter(x => x.type === "vr");

function summarizeTSX(p: string) {
  const s = readFileSync(p, "utf8");
  const name =
    /export\s+default\s+function\s+([A-Z]\w*)/.exec(s)?.[1] ||
    /const\s+([A-Z]\w*)\s*:\s*React\.FC/.exec(s)?.[1] ||
    /export\s+default\s+([A-Z]\w*)/.exec(s)?.[1] ||
    "Component";
  const hasTodo = /TODO|Placeholder/i.test(s);
  const props =
    /\(\s*\{\s*([^}]*)\}\s*:\s*[^)]*\)/
      .exec(s)?.[1]
      ?.split(",")
      .map(x => x.trim())
      .slice(0, 6) || [];
  return { name, hasTodo, props };
}

const uiReport = ui.map(x => ({ path: x.path, ...summarizeTSX(x.path) }));
const report = { ui: uiReport, vr };

writeFileSync("analysis/ui-vr-audit.json", JSON.stringify(report, null, 2));
console.log("✅ analysis/ui-vr-audit.json");
