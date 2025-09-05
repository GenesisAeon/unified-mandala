import fs from 'fs';
import { parse } from 'yaml';
import { execSync } from 'child_process';
import path from 'path';

const flow = parse(fs.readFileSync('docs/maps/ProgramFlow.yaml','utf8'));
let mermaid = 'graph TD\n';
if (Array.isArray(flow.nodes)) {
  for (const n of flow.nodes) {
    mermaid += `  ${n.id}[${n.id}]\n`;
  }
}
if (Array.isArray(flow.flows)) {
  for (const f of flow.flows) {
    if (Array.isArray(f.steps)) {
      for (const s of f.steps) {
        if (s.from && s.to) {
          mermaid += `  ${s.from}-->${s.to}\n`;
        }
      }
    }
  }
}
const dir = 'docs/diagrams';
fs.mkdirSync(dir,{recursive:true});
const mmdPath = path.join(dir,'program-flow.mmd');
fs.writeFileSync(mmdPath, mermaid);
try {
  execSync(`npx mmdc -i ${mmdPath} -o ${dir}/program-flow.svg`);
  console.log('generated program-flow.svg');
} catch (err) {
  console.error('mermaid generation failed', err);
  process.exitCode = 1;
}
