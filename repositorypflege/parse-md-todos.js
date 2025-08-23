const fs = require('fs');
const path = require('path');

function parseMdTodos(filePath) {
  const abs = path.resolve(filePath);
  const content = fs.readFileSync(abs, 'utf8');
  const tasks = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*- \[( |x|X)\]\s+(.*)$/);
    if (m) {
      tasks.push({ text: m[2].trim(), done: m[1].toLowerCase() === 'x' });
    }
  }
  return tasks;
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node parse-md-todos.js <markdown-file>');
    process.exit(1);
  }
  const tasks = parseMdTodos(file);
  for (const t of tasks) {
    console.log(`${t.done ? '[x]' : '[ ]'} ${t.text}`);
  }
}

module.exports = { parseMdTodos };
