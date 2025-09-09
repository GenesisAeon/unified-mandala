#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
let scanTodoComments;
try {
  ({ scanTodoComments } = require('../dist/shared-utils/todoCommentScanner.js'));
} catch {
  ({ scanTodoComments } = require('../packages/shared-utils/todoCommentScanner'));
}

function appendTasks(entries, yamlFile, jsonFile) {
  const loadYaml = f => (fs.existsSync(f) ? YAML.parse(fs.readFileSync(f, 'utf8')) : []);
  const loadJson = f => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
  const merge = (existing, add) => {
    const known = new Set(existing.map(e => e.commit));
    for (const e of add) {
      if (!known.has(e.commit)) {
        existing.push(e);
        known.add(e.commit);
      }
    }
    return existing;
  };
  const y = merge(loadYaml(yamlFile), entries);
  const j = merge(loadJson(jsonFile), entries);
  fs.writeFileSync(yamlFile, YAML.stringify(y, null, 2));
  fs.writeFileSync(jsonFile, JSON.stringify(j, null, 2));
}

function run(dir = path.join(__dirname, '..')) {
  const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
  const jsonFile = path.join(__dirname, '../advancedToDo.json');
  const todos = scanTodoComments(dir);
  const entries = todos.map(t => ({
    commit: `TODO in ${t.file}:${t.line}`,
    path: t.file,
    task: t.text,
    test: ''
  }));
  appendTasks(entries, yamlFile, jsonFile);
  console.log(`added ${entries.length} code todos from ${dir}`);
  return entries;
}

if (require.main === module) {
  run();
}

module.exports = { run };
