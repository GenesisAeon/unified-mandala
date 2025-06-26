#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const agentsFile = path.join(__dirname, '../AGENTS.md');
const docsDir = path.join(__dirname, '../docs/agents');

function extractAgents() {
  const text = fs.readFileSync(agentsFile, 'utf8');
  const lines = text.split(/\r?\n/);
  return lines.filter(l => l.includes('Agent:')).map(l => l.split('Agent:')[1].trim());
}

function ensureDocs(agent) {
  const file = path.join(docsDir, `${agent}.md`);
  if (!fs.existsSync(file)) {
    const content = `# ${agent}\n\nDokumentation in Arbeit.`;
    fs.writeFileSync(file, content);
    console.log(`Created ${file}`);
  }
}

function run() {
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  extractAgents().forEach(ensureDocs);
}

if (require.main === module) run();

module.exports = { run };
