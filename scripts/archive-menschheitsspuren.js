#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ARCHIVE_PATH = path.join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md');

function appendEntry(entry) {
  const line = `- ${entry}\n`;
  fs.appendFileSync(ARCHIVE_PATH, line);
}

if (require.main === module) {
  const text = process.argv.slice(2).join(' ');
  if (!text) {
    console.error('Usage: archive-menschheitsspuren.js "Fundort ..."');
    process.exit(1);
  }
  appendEntry(text);
  console.log('Entry appended');
}

module.exports = { appendEntry };
