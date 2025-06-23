import fs from 'fs';
import path from 'path';
const { parseMdTodo } = require('../parse-md-todo');

test('parseMdTodo extracts tasks and appends to files', () => {
  const md = path.join(__dirname, '../../__tmp.md');
  const yaml = path.join(__dirname, '../../__tmp.yaml');
  const json = path.join(__dirname, '../../__tmp.json');
  fs.writeFileSync(md, '* [ ] first task\n* [x] done task');
  fs.writeFileSync(yaml, '[]');
  fs.writeFileSync(json, '[]');
  const entries = parseMdTodo(md, yaml, json);
  const y = fs.readFileSync(yaml, 'utf8');
  const j = fs.readFileSync(json, 'utf8');
  expect(entries.length).toBe(2);
  expect(y.includes('first task')).toBe(true);
  expect(j.includes('first task')).toBe(true);
  fs.rmSync(md);
  fs.rmSync(yaml);
  fs.rmSync(json);
});
