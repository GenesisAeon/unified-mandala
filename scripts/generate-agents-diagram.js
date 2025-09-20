#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, '../docs/diagrams/agents_chain.mmd');
const output = path.join(__dirname, '../docs/diagrams/agents_chain.svg');

try {
  execSync(`npx -y @mermaid-js/mermaid-cli -i ${input} -o ${output}`, { stdio: 'inherit' });
  console.log('agents_chain.svg generated.');
} catch (err) {
  console.error('Failed to generate agents_chain.svg, creating placeholder.');
  const placeholder =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><text x="20" y="100">Mermaid generation failed</text></svg>';
  writeFileSync(output, placeholder);
  process.exit(0);
}
