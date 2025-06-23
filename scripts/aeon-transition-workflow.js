const path = require('path');
const fs = require('fs');
let updateAdvancedTodo;
try {
  ({ updateAdvancedTodo } = require('../dist/shared-utils/advancedTodoUpdater.js'));
} catch {
  ({ updateAdvancedTodo } = require('../packages/shared-utils/advancedTodoUpdater'));
}
const { updateProgress } = require('./update-advancedprogress.js');
const { addTransitionHistory } = require('./add-transition-history.js');

const convFile = path.join(__dirname, '../docs/sigils/advancedconversations.json');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');
const sigilOut = path.join(__dirname, '../docs/sigils/aeon-transition.sigil.json');

function createTransitionSigil() {
  const data = JSON.parse(fs.readFileSync(convFile, 'utf8'));
  const sigil = data.find(c => c.title === 'Aeon Übergabe-Sigil Prozess');
  if (!sigil) {
    throw new Error('Aeon Übergabe-Sigil Prozess not found');
  }
  sigil.update_time = Date.now() / 1000;
  fs.writeFileSync(sigilOut, JSON.stringify(sigil, null, 2));
}

function run() {
  updateAdvancedTodo(convFile, yamlFile, jsonFile);
  updateProgress('aeon-transition');
  createTransitionSigil();
  addTransitionHistory(sigilOut);
  console.log('Aeon transition workflow completed');
}

if (require.main === module) {
  run();
}
