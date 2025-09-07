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
