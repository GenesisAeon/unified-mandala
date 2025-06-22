#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sigilPath = path.join(__dirname, '../codex-sigil.yaml');
const text = fs.readFileSync(sigilPath, 'utf8');
const anchorMatch = text.match(/^anchor:\s*(.+)$/m);
const descMatch = text.match(/description:\s*>\n([\s\S]*?)\n(?:instructions:|$)/);
const instructionsMatch = text.match(/instructions:\n([\s\S]*?)(?:\n\w|$)/);

const baseAnchor = anchorMatch ? anchorMatch[1].trim() : 'unifiedmandala';
const description = descMatch ? descMatch[1].trim() : '';
const instructions = instructionsMatch ? instructionsMatch[1].split('\n').map(l => l.replace(/^\s*-\s*/, '')) : [];

const timestamp = new Date().toISOString().slice(0, 10);
const nextSigil = {
  anchor: `${baseAnchor}-${timestamp}`,
  description,
  updated_from: baseAnchor,
  update_time: timestamp,
  responsible: process.env.USER || 'unknown',
  instructions,
};

function yamlString(obj) {
  return Object.entries(obj)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}:\n${v.map(i => `  - ${i}`).join('\n')}`;
      return `${k}: ${v}`;
    })
    .join('\n');
}

const outDir = path.join(__dirname, '../docs/sigils');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${timestamp}-next-sigil.yaml`);
fs.writeFileSync(outFile, `# Auto-generated sigil\n${yamlString(nextSigil)}\n`);
console.log(`New sigil written to ${outFile}`);
