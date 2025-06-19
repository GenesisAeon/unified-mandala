/** @jest-environment node */
import fs from 'fs';
import path from 'path';
import { updateAdvancedTodo } from './advancedTodoUpdater';

describe('updateAdvancedTodo', () => {
  const tmp = path.join(__dirname, '__todo_tmp__');
  const conv = path.join(tmp, 'conv.json');
  const yml = path.join(tmp, 'todo.yaml');
  const json = path.join(tmp, 'todo.json');

  beforeAll(() => {
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
    const data = [
      { id: 'c1', mapping: { root: { message: { content: { parts: ['Test'] } } }, node2: { message: { content: { parts: ['// TODO: first task'] } } } } },
      { id: 'c2', mapping: { root: { message: { content: { parts: ['# TODO second task'] } } } } }
    ];
    fs.writeFileSync(conv, JSON.stringify(data), 'utf8');
  });

  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('extracts todos and writes files', () => {
    const entries = updateAdvancedTodo(conv, yml, json);
    expect(entries.length).toBe(2);
    const yamlOut = fs.readFileSync(yml, 'utf8');
    const jsonOut = JSON.parse(fs.readFileSync(json, 'utf8'));
    expect(yamlOut).toContain('first task');
    expect(jsonOut[0].task).toBe('first task');
  });
});
