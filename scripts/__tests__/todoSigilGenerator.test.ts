import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
const { generateTodoFromRepo } = require('../todoSigilGenerator');

test('generateTodoFromRepo appends entries', () => {
  const yaml = path.join(__dirname, '../../__tmp_todo.yaml');
  const json = path.join(__dirname, '../../__tmp_todo.json');
  fs.writeFileSync(yaml, YAML.stringify([]));
  fs.writeFileSync(json, JSON.stringify([]));
  const entries = generateTodoFromRepo(yaml, json);
  const yamlOut = YAML.parse(fs.readFileSync(yaml, 'utf8'));
  const jsonOut = JSON.parse(fs.readFileSync(json, 'utf8'));
  expect(entries.length).toBeGreaterThan(0);
  expect(yamlOut.length).toBeGreaterThan(0);
  expect(jsonOut.length).toBeGreaterThan(0);
  fs.rmSync(yaml);
  fs.rmSync(json);
});
