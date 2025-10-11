#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
let extractTodosFromFile;
try {
  ({ extractTodosFromFile } = require('../dist/shared-utils/todoParser.js'));
} catch {
  ({ extractTodosFromFile } = require('../packages/shared-utils/todoParser'));
}

function appendTasks(entries, yamlFile, jsonFile) {
  const loadYaml = (f) => (fs.existsSync(f) ? YAML.parse(fs.readFileSync(f, 'utf8')) : []);
  const loadJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
  const merge = (existing, add) => {
    const known = new Set(existing.map((e) => e.commit));
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

function parseMdTodo(
  mdFile,
  yamlFile = path.join(__dirname, '../advancedToDo.yaml'),
  jsonFile = path.join(__dirname, '../advancedToDo.json'),
) {
  const todos = extractTodosFromFile(mdFile);
  const entries = todos.map((t) => ({
    commit: `TODO from ${path.basename(mdFile)} - ${t.text.slice(0, 40)}`,
    path: mdFile,
    task: t.text,
    test: '',
  }));
  appendTasks(entries, yamlFile, jsonFile);
  console.log(`added ${entries.length} todos from ${mdFile}`);
  return entries;
}

if (require.main === module) {
  const mdFile = process.argv[2];
  if (!mdFile) {
    console.error('Usage: node parse-md-todo.js <markdown-file> [yaml-file] [json-file]');
    process.exit(1);
  }
  parseMdTodo(mdFile, process.argv[3], process.argv[4]);
}

module.exports = { parseMdTodo };
