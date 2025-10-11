#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
let scanDir;
try {
  ({ scanTodoCommentsInDir: scanDir } = require('../dist/shared-utils/todoCommentScanner.js'));
} catch {
  ({ scanTodoCommentsInDir: scanDir } = require('../packages/shared-utils/todoCommentScanner'));
}
function update() {
  const repoRoot = path.join(__dirname, '..');
  const sigilPath = path.join(repoRoot, 'docs/sigils/todo-sigil.yaml');
  const data = fs.existsSync(sigilPath) ? YAML.parse(fs.readFileSync(sigilPath, 'utf8')) : {};
  const base = Array.isArray(data.aufgaben)
    ? data.aufgaben.filter((t) => !(t.id && String(t.id).startsWith('code-')))
    : [];
  const todos = scanDir(repoRoot);
  const codeTasks = todos.map((t, i) => ({
    id: `code-${i + 1}`,
    beschreibung: `${path.relative(repoRoot, t.file)}:${t.line} ${t.text}`,
    status: 'offen',
  }));
  const out = {
    sigillin_id: data.sigillin_id || 'aeon:2025-0605-TODO',
    symbolzeit: data.symbolzeit || 'tag',
    titel: data.titel || 'UnifiedMandala ToDo Übersicht',
    aufgaben: [...base, ...codeTasks],
  };
  fs.writeFileSync(sigilPath, YAML.stringify(out));
  console.log(`updated ${sigilPath} with ${codeTasks.length} code TODOs`);
}
if (require.main === module) update();
module.exports = { update };
