#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let scanTodoComments;
let createTodoSigil;
try {
  ({ scanTodoComments } = require('../dist/shared-utils/todoCommentScanner.js'));
} catch {
  ({ scanTodoComments } = require('../packages/shared-utils/todoCommentScanner'));
}
try {
  ({ createTodoSigil } = require('../dist/shared-utils/todoSigilGenerator.js'));
} catch {
  ({ createTodoSigil } = require('../packages/shared-utils/todoSigilGenerator'));
}

function parseTodoSigil(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const items = [];
  let current = null;
  for (const line of lines) {
    const idMatch = line.match(/^\s*- id: (.+)$/);
    if (idMatch) {
      current = { id: idMatch[1] };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const descMatch = line.match(/^\s*beschreibung:\s+"?(.*)"?$/);
    if (descMatch) current.beschreibung = descMatch[1];
    const statusMatch = line.match(/^\s*status:\s+(\S+)\s*$/);
    if (statusMatch) current.status = statusMatch[1];
  }
  return items;
}

function run() {
  const repo = path.join(__dirname, '..');
  const sigilFile = path.join(repo, 'docs/sigils/todo-sigil.yaml');
  const comments = scanTodoComments(repo);
  const existing = parseTodoSigil(sigilFile).map(it => ({
    text: it.beschreibung,
    done: it.status === 'erledigt'
  }));
  const texts = new Set(existing.map(t => t.text));
  comments.forEach(c => {
    const text = `${c.text} (${c.file}:${c.line})`;
    if (!texts.has(text)) {
      existing.push({ text, done: false });
      texts.add(text);
    }
  });
  const yaml = createTodoSigil(existing);
  fs.writeFileSync(sigilFile, yaml);
  console.log(`todo-sigil.yaml updated with ${comments.length} TODO comments.`);
}

if (require.main === module) {
  run();
}

module.exports = { run };
