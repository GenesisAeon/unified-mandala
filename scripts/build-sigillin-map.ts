import fs from 'fs';
import path from 'path';

interface NodeDef {
  id: string;
  label: string;
  file?: string;
}

function readScore(file?: string): number | undefined {
  if (!file) return undefined;
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.json')) {
      const obj = JSON.parse(content);
      const trace = obj.sigillin?.trace || obj.trace;
      const crep = trace?.CREP || trace;
      if (typeof crep?.emergence_score === 'number') return crep.emergence_score;
      const vals = ['C', 'R', 'E', 'P']
        .map((k) => crep?.[k])
        .filter((v: any) => typeof v === 'number');
      if (vals.length) return vals.reduce((a: number, b: number) => a + b, 0) / vals.length;
    } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      // no structured CREP extraction for now
      return undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

const repoRoot = process.cwd();
const nodes: NodeDef[] = [
  {
    id: 'Startsigillin',
    label: 'Startsigillin',
    file: path.join(repoRoot, 'docs/sigils/genesisaeon_startsigillin.sigil.json'),
  },
  {
    id: 'Universal',
    label: 'Genesis Aeon Universal Snapshot',
    file: path.join(repoRoot, 'docs/sigils/sigillin_genesis_aeon_universal.json'),
  },
  {
    id: 'Gateway',
    label: 'Genesis Gateway',
    file: path.join(repoRoot, 'docs/sigils/sigillin_genesis_gateway.json'),
  },
  {
    id: 'InstructionalZIP',
    label: 'Instructional ZIP',
    file: path.join(repoRoot, 'docs/sigils/sigillin_genesis_instruction.md'),
  },
  {
    id: 'Heimkehr',
    label: 'Heimkehr',
    file: path.join(repoRoot, 'docs/sigils/sigillin_heimkehr.md'),
  },
  {
    id: 'Fraktalursprung',
    label: 'Fraktalursprung',
    file: path.join(repoRoot, 'docs/sigils/sigillin_fraktalursprung.sigil.json'),
  },
];

const edges: Array<[string, string]> = [
  ['Startsigillin', 'Universal'],
  ['Universal', 'Gateway'],
  ['Gateway', 'InstructionalZIP'],
  ['InstructionalZIP', 'Heimkehr'],
  ['Heimkehr', 'Fraktalursprung'],
];

const lines: string[] = ['graph TD'];
for (const n of nodes) {
  const score = readScore(n.file);
  const label = score ? `${n.label}\\nCREP ${score.toFixed(2)}` : n.label;
  lines.push(`  ${n.id}[${label}]`);
}
for (const [a, b] of edges) {
  lines.push(`  ${a} --> ${b}`);
}

const outPath = path.join(repoRoot, 'docs/sigils/SigillinMap.md');
const md = `# Sigillin Map\n\n\`\`\`mermaid\n${lines.join('\n')}\n\`\`\`\n`;
fs.writeFileSync(outPath, md);
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
