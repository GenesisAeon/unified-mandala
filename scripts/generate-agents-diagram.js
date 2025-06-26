#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const input = path.join(__dirname, '../docs/diagrams/agents_chain.mmd');
const output = path.join(__dirname, '../docs/diagrams/agents_chain.svg');

try {
  execSync(`npx -y @mermaid-js/mermaid-cli -i ${input} -o ${output}`, { stdio: 'inherit' });
  console.log('agents_chain.svg generated.');
} catch (err) {
  console.error('Failed to generate agents_chain.svg, creating placeholder.');
  const fs = require('fs');
  const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><text x="20" y="100">Mermaid generation failed</text></svg>`;
  fs.writeFileSync(output, placeholder);
  process.exit(0);
}

