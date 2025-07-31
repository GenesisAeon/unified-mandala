#!/usr/bin/env node
const path = require('path');
let { updateFractalTodos } = require('../packages/shared-utils/sigillinFractalTodo');
const { updateProgress } = require('./update-advancedprogress.js');

const sigFile = path.join(__dirname, '../docs/sigils/2025-07-30-codex-fraktal-init.yaml');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');

const entries = updateFractalTodos(sigFile, yamlFile, jsonFile);
console.log(`advancedToDo updated with ${entries.length} fractal tasks.`);
updateProgress('sync');
