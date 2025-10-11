import fs from 'node:fs';
const index = JSON.parse(fs.readFileSync('out/sigillin_index.json', 'utf8'));
const nodes = (index.sigils || []).map((s) => ({
  id: s.id,
  emergence: s.metrics?.emergencePotential ?? 0,
  source: s.sourceId ?? 'unknown',
  lifecycle: s.metrics?.lifecycle ?? 'beta',
}));
const links = [];
(index.sigils || []).forEach((s) =>
  (s.connections || []).forEach((t) => links.push({ source: s.id, target: t })),
);
fs.writeFileSync('out/sigils_graph.json', JSON.stringify({ nodes, links }, null, 2));
fs.writeFileSync(
  'out/sigils_graph.mmd',
  `graph TD\n` + links.map((l) => `  ${l.source}-->${l.target}`).join('\n'),
);
console.log('✅ wrote out/sigils_graph.{json,mmd}');
