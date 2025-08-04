const path = require('path');
const { updateAdvancedTodo } = require('../packages/shared-utils/advancedTodoUpdater');

function updateFromNewConvos(
  convPath = path.join(__dirname, '../docs/sigils/newadvancedconversations.json'),
  yamlPath = path.join(__dirname, '../advancedToDo.yaml'),
  jsonPath = path.join(__dirname, '../advancedToDo.json'),
  options = { includeImplicit: true }
) {
  updateAdvancedTodo(convPath, yamlPath, jsonPath, options);
  console.log(`Updated advancedToDo files from ${path.basename(convPath)}`);
}

if (require.main === module) {
  updateFromNewConvos();
}

module.exports = { updateFromNewConvos };
