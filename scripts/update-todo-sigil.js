#!/usr/bin/env node
const path = require('path');
const { checks } = require('./check-todo-sigil');
let updateTodoSigilStatus;
try {
  ({ updateTodoSigilStatus } = require('../dist/shared-utils/todoSigilUpdater.js'));
} catch {
  ({ updateTodoSigilStatus } = require('../packages/shared-utils/todoSigilUpdater'));
}

const file = path.join(__dirname, '../docs/sigils/todo-sigil.yaml');

async function run() {
  await updateTodoSigilStatus(file, checks);
  console.log('todo-sigil.yaml status aktualisiert.');
}

run();
