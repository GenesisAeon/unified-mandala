#!/usr/bin/env node
/**
 * RepoMap: traverses the repo, extracts modules (packages/apps/services),
 * UI components, VR components, agents, scripts, and npm/pnpm “scripts”.
 * Outputs JSON + CSV for quick orientation and spreadsheets.
 *
 * Usage:
 *   pnpm ts-node scripts/repo-map.ts
 *   node scripts/repo-map.js            // after build:js fallback
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = {
  path: string;
  type: "package" | "app" | "service" | "docs" | "config" | "agent" | "ui" | "vr" | "script" | "other";
  name?: string;
  meta?: Record<string, any>;
};

const ROOT = process.cwd();
const OUT_JSON = "analysis/repo-map.json";
const OUT_CSV = "analysis/repo-map.csv";
const OUT_CMDS = "analysis/scripts-and-commands.json";

const UI_HINTS = [/components\/.*\.(tsx|jsx)$/i, /packages\/.*ui.*\/components/i, /apps\/.*interface\/components/i];
const VR_HINTS = [/unifiedmandala-vr/i, /VR/i, /PyramidVRMeetingRoom\.tsx$/];
const AGENT_HINTS = [/agents?\//i, /Agent\.(ts|js)$/i, /plugins?\//i];
const SCRIPT_HINTS = [/^scripts?\/.*\.(ts|js|mjs)$/i];

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".pnpm",
  "dist",
  "build",
  "coverage",
  "out"
]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      walk(p, acc);
    } else if (!entry.endsWith(".disabled")) {
      acc.push(p);
    }
  }
  return acc;
}

function classify(p: string): Item["type"] {
  const lc = p.toLowerCase();
  if (lc.includes("/packages/")) return "package";
  if (lc.includes("/apps/")) return "app";
  if (lc.includes("/services/")) return "service";
  if (lc.includes("/docs/")) return "docs";
  if (lc.includes("/config/") || lc.endsWith(".yaml") || lc.endsWith(".yml")) return "config";
  if (AGENT_HINTS.some(rx => rx.test(p))) return "agent";
  if (UI_HINTS.some(rx => rx.test(p))) return "ui";
  if (VR_HINTS.some(rx => rx.test(p))) return "vr";
  if (SCRIPT_HINTS.some(rx => rx.test(p))) return "script";
  return "other";
}

function tryPkgScripts(dir: string): Record<string, string> | undefined {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    return pkg.scripts;
  } catch {
    return;
  }
}

function collectScripts(): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  const dirs = [
    ROOT,
    ...readdirSync(ROOT)
      .filter(d => statSync(join(ROOT, d)).isDirectory())
      .map(d => join(ROOT, d))
  ];
  for (const d of dirs) {
    const scripts = tryPkgScripts(d);
    if (scripts && Object.keys(scripts).length) {
      const key = d.replace(ROOT + "/", "") || "root";
      result[key] = scripts;
    }
  }
  return result;
}

function toCSV(rows: Item[]): string {
  const header = ["type", "path", "name"];
  const escape = (v: string | undefined) => (v ?? "").replace(/"/g, '""');
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.type, `"${escape(r.path)}"`, `"${escape(r.name)}"`].join(","));
  }
  return lines.join("\n");
}

const files = walk(ROOT);
const items: Item[] = files.map(p => ({ path: p, type: classify(p), name: p.split("/").slice(-1)[0] }));
writeFileSync(OUT_JSON, JSON.stringify(items, null, 2));
writeFileSync(OUT_CSV, toCSV(items), "utf8");

const scriptsMap = collectScripts();
writeFileSync(OUT_CMDS, JSON.stringify(scriptsMap, null, 2));

console.log(`✅ RepoMap JSON → ${OUT_JSON}`);
console.log(`✅ RepoMap CSV  → ${OUT_CSV}`);
console.log(`✅ Scripts & Commands → ${OUT_CMDS}`);
