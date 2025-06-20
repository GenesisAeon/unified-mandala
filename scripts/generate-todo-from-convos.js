const path = require('path');
let { extractImplicitTodosFromConversations } = (() => {
  try {
    return require('../dist/shared-utils/conversationAnalyzer.js');
  } catch {
    return require('../packages/shared-utils/conversationAnalyzer');
  }
})();
let { createTodoSigil } = (() => {
  try {
    return require('../dist/shared-utils/todoSigilGenerator.js');
  } catch {
    return require('../packages/shared-utils/todoSigilGenerator');
  }
})();
const fs = require('fs');

function generateTodoFromConvos(sourcePath = path.join(__dirname, '../docs/sigils/advancedconversations.json')) {
  const outPath = path.join(__dirname, '../docs/sigils/todo-from-convos.yaml');
  const tasks = extractImplicitTodosFromConversations(path.resolve(sourcePath)).map(t => ({ text: t, done: false }));
  const yaml = createTodoSigil(tasks, { id: 'aeon:todo-from-convos', titel: 'Konversations ToDos', symbolzeit: 'tag' });
  fs.writeFileSync(outPath, yaml);
  console.log(`todo-from-convos.yaml generated from ${path.basename(sourcePath)}`);
}

if (require.main === module) {
  const src = process.argv[2];
  generateTodoFromConvos(src);
}

module.exports = { generateTodoFromConvos };
