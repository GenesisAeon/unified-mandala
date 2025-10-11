#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function generate() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const report =
    `# Framework Report\n\nVersion: ${pkg.version}\n\nEnthaltene Pakete:\n` +
    pkg.workspaces.map((w) => `- ${w}`).join('\n');
  fs.writeFileSync(path.join('docs', 'FrameworkReport.md'), report);
  return report;
}

if (require.main === module) {
  console.log(generate());
}

module.exports = { generate };
