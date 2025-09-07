#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"

w() { mkdir -p "$(dirname "$ROOT/$1")"; cat >"$ROOT/$1"; }

# Config
w config/universe-tree.yaml <<'EOC'
seed: 42
branching_factor: 2
depth: 3
mutation_sigma: 0.1
penalty: 0.0
EOC

w config/seed-models.yaml <<'EOS'
models:
  - name: emergence_predictor
    input: features.csv
  - name: consent_mesh_sim
    input: mesh.json
EOS

w config/utopie-adapter.yaml <<'EOU'
sources:
  - name: mobility_2030
    sigil: sigil:mobility-2030
    value: 0.8
EOU

# Processes (Node ESM: stelle sicher, dass package.json "type":"module" gesetzt hat)
w processes/universe-tree.js <<'EOUT'
import fs from "fs";
import path from "path";
const outDir = process.env.OUT_DIR || "runs";
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, "artifacts", "tree.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
const tree = { "R0": ["R1","R2"], "R1": ["R1a","R1b"], "R2": ["R2a"] };
fs.writeFileSync(target, JSON.stringify(tree, null, 2));
console.log("[universe-tree] wrote", target);
EOUT

w processes/seed-models.js <<'EOSS'
import fs from "fs";
import path from "path";
const outDir = process.env.OUT_DIR || "runs";
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, "artifacts", "seed_results.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
const results = [
  { modelName: "emergence_predictor", crepResonance: 0.72 },
  { modelName: "consent_mesh_sim", crepResonance: 0.64 }
];
fs.writeFileSync(target, JSON.stringify(results, null, 2));
console.log("[seed-models] wrote", target);
EOSS

w processes/utopie-adapter.js <<'EOUA'
import fs from "fs";
import path from "path";
const outDir = process.env.OUT_DIR || "runs";
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, "artifacts", "utopia_rows.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
const rows = [
  { source: "utopie_adapter", sigil: "sigil:mobility-2030", value: 0.8, timestamp: new Date().toISOString() }
];
fs.writeFileSync(target, JSON.stringify(rows, null, 2));
console.log("[utopie-adapter] wrote", target);
EOUA

# Report + Runner
w runners/report.ts <<'EOR'
import fs from "fs";

type UniverseTree = Record<string, string[]>;
type SeedModelResult = { modelName: string; crepResonance: number };
type UtopiaRow = { source: string; sigil: string; value: number; timestamp: string };

function generateMermaidTree(tree: UniverseTree): string {
  const lines: string[] = ["graph TD;"];
  for (const [node, children] of Object.entries(tree)) {
    if (!children || children.length===0) { lines.push(`${node}`); continue; }
    lines.push(`${node}-->${children.join(`\n${node}-->`)}`);
  }
  return lines.join("\n");
}

export function generateHTMLReport(outPath: string, tree: UniverseTree, seed: SeedModelResult[], utopia: UtopiaRow[]) {
  const html = `<!doctype html>
<html><head>
  <meta charset="utf-8"/>
  <title>Mandala Research Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body{font-family:Inter,Arial,sans-serif;margin:24px}
    .chart{width:80%;margin:24px auto}
    table{border-collapse:collapse;width:90%}
    th,td{border:1px solid #ddd;padding:8px}
    th{background:#f5f5f5}
    .mermaid{margin:24px auto;max-width:90%}
  </style>
</head>
<body>
  <h1>Mandala Research Report</h1>
  <h2>Universe Tree</h2>
  <div class="mermaid">${generateMermaidTree(tree)}</div>
  <h2>Seed Model Results</h2>
  <div class="chart"><canvas id="resonanceChart"></canvas></div>
  <script>
    const ctx = document.getElementById('resonanceChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(["emergence_predictor","consent_mesh_sim"])} ,
        datasets: [{ label: 'CREP Resonance', data: ${JSON.stringify([0.72,0.64])} }]
      },
      options: { responsive:true, scales: { y: { beginAtZero: true, max: 1 } } }
    });
  </script>
  <h2>Utopia Adapter Data</h2>
  <table>
    <tr><th>Source</th><th>Sigil</th><th>Value</th><th>Timestamp</th></tr>
    ${utopia.map(d=>`<tr><td>${d.source}</td><td>${d.sigil}</td><td>${d.value}</td><td>${d.timestamp}</td></tr>`).join("")}
  </table>
  <script>mermaid.initialize({ startOnLoad: true });</script>
</body></html>`;
  fs.writeFileSync(outPath, html);
  console.log("Report written:", outPath);
}
EOR

w runners/subprocess-bridge.ts <<'EOSB'
import { fork } from "child_process";
import path from "path";
import fs from "fs";
import { generateHTMLReport } from "./report.js";

function runChild(script: string, env: Record<string,string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = fork(script, [], { env: { ...process.env, ...env }, stdio: "inherit" as any });
    p.on("exit", code => code===0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
    p.on("error", reject);
  });
}

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  const outDir = path.join(process.cwd(), "runs", ts);
  const artifacts = path.join(outDir, "artifacts");
  fs.mkdirSync(artifacts, { recursive: true });

  const env = { OUT_DIR: path.join(process.cwd(), "runs"), RUN_ID: ts };

  await runChild(path.join(process.cwd(), "processes", "universe-tree.js"), env);
  await runChild(path.join(process.cwd(), "processes", "seed-models.js"), env);
  await runChild(path.join(process.cwd(), "processes", "utopie-adapter.js"), env);

  const tree = JSON.parse(fs.readFileSync(path.join(artifacts,"tree.json"),"utf-8"));
  const seed = JSON.parse(fs.readFileSync(path.join(artifacts,"seed_results.json"),"utf-8"));
  const utopia = JSON.parse(fs.readFileSync(path.join(artifacts,"utopia_rows.json"),"utf-8"));

  await generateHTMLReport(path.join(outDir,"report.html"), tree, seed, utopia);
  console.log("Done:", outDir);
}
main().catch(e => { console.error(e); process.exit(1); });
EOSB

echo "PR-F tree written under $ROOT"
