#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const readmePath = path.join(root, 'README.md');
const handbookPath = path.join(root, 'Handbuch.md');

const readme = fs.readFileSync(readmePath, 'utf8');

function extractSection(title) {
  const start = readme.indexOf(title);
  if (start === -1) return '';
  const rest = readme.slice(start + title.length);
  const next = rest.search(/^##\s/m);
  const endIndex = next === -1 ? readme.length : start + title.length + next;
  return readme.slice(start, endIndex).trim();
}

const sections = [
  '## \uD83D\uDE80 Features',
  '## \uD83D\uDCE6 Paketstruktur',
  '## \uD83D\uDCBB Schnellstart',
  '## \uD83C\uDF00 Mandala-Poesie und Automation'
];

let content = '\n## README-Highlights\n\n';
for (const title of sections) {
  const sec = extractSection(title);
  if (sec) content += sec + '\n\n';
}

const marker = '<!-- README_HIGHLIGHTS -->';
let handbook = fs.readFileSync(handbookPath, 'utf8');

if (handbook.includes(marker)) {
  handbook = handbook.replace(new RegExp(marker + '[\n\r]*[^]*'), marker + '\n' + content.trim() + '\n');
} else {
  handbook += '\n' + marker + '\n' + content;
}

fs.writeFileSync(handbookPath, handbook.trimEnd() + '\n');
console.log('Handbuch updated from README.');
