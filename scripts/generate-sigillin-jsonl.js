#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

async function main() {
  const sigilsDir = path.resolve(__dirname, '..', 'docs', 'sigils');
  const outFile = path.resolve(__dirname, '..', 'data', 'sigils', 'sigillin.jsonl');

  const files = globSync('**/*.{yaml,yml,json}', {
    cwd: sigilsDir,
    ignore: ['*conversations*']
  });

  const lines = files.map((file) => {
    const full = path.join(sigilsDir, file);
    const content = fs.readFileSync(full, 'utf8');
    return JSON.stringify({ file, content });
  });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, lines.join('\n') + '\n');
  console.log(`Wrote ${lines.length} entries to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
