const path = require('path');
let updateAdvancedTodo;
try {
  ({ updateAdvancedTodo } = require('../dist/shared-utils/advancedTodoUpdater.js'));
} catch {
  ({ updateAdvancedTodo } = require('../packages/shared-utils/advancedTodoUpdater'));
}

const convFile = path.join(__dirname, '../docs/sigils/advancedconversations.json');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');

const entries = updateAdvancedTodo(convFile, yamlFile, jsonFile, { includeImplicit: true });
console.log(`advancedToDo updated with ${entries.length} tasks.`);
