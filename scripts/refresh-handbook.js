#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function extractDocs(dir) {
  const files = fs.readdirSync(dir);
  let out = '';
  files.forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) return;
    const text = fs.readFileSync(p, 'utf8');
    const matches = text.match(/\/\/\/\s*(.*)/g);
    if (matches) out += matches.map((m) => m.replace('///', '').trim()).join('\n') + '\n';
  });
  return out;
}

const sections = extractDocs('packages');
const handbook = path.join(__dirname, '..', 'Handbuch.md');
const content = fs.readFileSync(handbook, 'utf8') + '\n\n' + sections;
fs.writeFileSync(handbook, content);
console.log('Handbuch aktualisiert');
