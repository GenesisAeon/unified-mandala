#!/usr/bin/env node
const fs = require('fs');
const path = process.argv[2];
if (!path) {
  console.error('Usage: nucleon-scanner-analysis.js <logfile>');
  process.exit(1);
}
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const errorCount = lines.filter(l => l.includes('ERROR')).length;
const resonanceLines = lines.filter(l => l.includes('resonance'));
console.log(`Lines: ${lines.length}`);
console.log(`Errors: ${errorCount}`);
console.log(`Resonance mentions: ${resonanceLines.length}`);
