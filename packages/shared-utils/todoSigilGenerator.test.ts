import fs from 'fs';
import path from 'path';
import { createTodoSigil, generateTodoSigilFromFile } from './todoSigilGenerator';
import { TodoItem } from './todoParser';

const tmp = path.join(__dirname, '__tmp_tsgen');
const src = path.join(tmp, 'tasks.md');
const dest = path.join(tmp, 'todo.yaml');

beforeAll(() => {
  if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
  fs.writeFileSync(src, '* [ ] first\n* [x] done', 'utf8');
});

afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('createTodoSigil returns YAML', () => {
  const yaml = createTodoSigil([
    { text: 'a', done: false },
    { text: 'b', done: true },
  ] as TodoItem[]);
  expect(yaml).toContain('sigillin_id');
  expect(yaml).toContain('task-2');
});

test('generateTodoSigilFromFile writes file', () => {
  generateTodoSigilFromFile(src, dest);
  const out = fs.readFileSync(dest, 'utf8');
  expect(out).toContain('task-1');
});
