const fs = require('fs');
const path = require('path');

function extractTodos(text) {
  const tasks = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\* \[( |x)\] (.+)$/);
    if (m) tasks.push({ text: m[2].trim(), done: m[1] === 'x' });
  }
  return tasks;
}

function generateTodoSigil(sourcePath = path.join(__dirname, '../docs/mastercanvas.yaml')) {
  const content = fs.readFileSync(sourcePath, 'utf8');
  const tasks = extractTodos(content);
  const yamlLines = [];
  yamlLines.push('sigillin_id: aeon:2025-0605-TODO');
  yamlLines.push('symbolzeit: tag');
  yamlLines.push('titel: UnifiedMandala ToDo Übersicht');
  yamlLines.push('aufgaben:');
  tasks.forEach((t, idx) => {
    yamlLines.push(`  - id: task-${idx + 1}`);
    yamlLines.push(`    beschreibung: "${t.text.replace(/\"/g, '\\"')}"`);
    yamlLines.push(`    status: ${t.done ? 'erledigt' : 'offen'}`);
  });
  const outPath = path.join(__dirname, '../docs/sigils/todo-sigil.yaml');
  fs.writeFileSync(outPath, yamlLines.join('\n') + '\n');
  console.log(`todo-sigil.yaml updated from ${path.basename(sourcePath)}`);
}

if (require.main === module) {
  const src = process.argv[2];
  generateTodoSigil(src);
}

module.exports = { generateTodoSigil };
