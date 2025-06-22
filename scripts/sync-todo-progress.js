#!/usr/bin/env node
const path = require('path');
let updateAdvancedTodo;
try {
  ({ updateAdvancedTodo } = require('../dist/shared-utils/advancedTodoUpdater.js'));
} catch {
  ({ updateAdvancedTodo } = require('../packages/shared-utils/advancedTodoUpdater'));
}
const { updateProgress } = require('./update-advancedprogress.js');

const convFile = path.join(__dirname, '../docs/sigils/advancedconversations.json');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');

const entries = updateAdvancedTodo(convFile, yamlFile, jsonFile);
console.log(`advancedToDo updated with ${entries.length} tasks.`);
updateProgress('sync');
