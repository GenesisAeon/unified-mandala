#!/usr/bin/env node
const path = require('path');
let { updateAdvancedTodo } = require('../packages/shared-utils/advancedTodoUpdater.js');
const { updateProgress } = require('./update-advancedprogress.js');

const convFile = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');

const entries = updateAdvancedTodo(convFile, yamlFile, jsonFile, { includeImplicit: true });
console.log(
  `advancedToDo updated with ${entries.length} tasks from newadvancedconversations.json.`,
);
updateProgress('sync');
