const path = require('path');
let generateTodoSigilFromFile;
try {
  ({ generateTodoSigilFromFile } = require('../dist/shared-utils/todoSigilGenerator.js'));
} catch {
  ({ generateTodoSigilFromFile } = require('../packages/shared-utils/todoSigilGenerator'));
}

function generateTodoSigil(sourcePath = path.join(__dirname, '../docs/mastercanvas.yaml')) {
  const outPath = path.join(__dirname, '../docs/sigils/todo-sigil.yaml');
  generateTodoSigilFromFile(path.resolve(sourcePath), outPath);
  console.log(`todo-sigil.yaml updated from ${path.basename(sourcePath)}`);
}

if (require.main === module) {
  const src = process.argv[2];
  generateTodoSigil(src);
}

module.exports = { generateTodoSigil };
