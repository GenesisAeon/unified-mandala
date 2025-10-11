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
      {
        id: 'c1',
        mapping: {
          root: { message: { content: { parts: ['Test'] } } },
          node2: { message: { content: { parts: ['// TODO: first sample task'] } } },
        },
      },
      {
        id: 'c2',
        mapping: { root: { message: { content: { parts: ['# TODO second sample task'] } } } },
      },
      {
        id: 'c3',
        mapping: {
          root: { message: { content: { parts: ['Wir sollten zusätzliche Tests schreiben'] } } },
        },
      },
    ];
    fs.writeFileSync(conv, JSON.stringify(data), 'utf8');
  });

  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('extracts explicit and implicit todos and writes files', () => {
    const entries = updateAdvancedTodo(conv, yml, json, { includeImplicit: true });
    expect(entries.length).toBe(3);
    const yamlOut = fs.readFileSync(yml, 'utf8');
    const jsonOut = JSON.parse(fs.readFileSync(json, 'utf8'));
    expect(yamlOut).toContain('first sample task');
    expect(yamlOut).toContain('zusätzliche Tests schreiben');
    expect(jsonOut[0].task).toBe('first sample task');
  });

  test('limits number of entries when maxEntries set', () => {
    const yml2 = path.join(tmp, 'todo2.yaml');
    const json2 = path.join(tmp, 'todo2.json');
    const entries = updateAdvancedTodo(conv, yml2, json2, { includeImplicit: true, maxEntries: 2 });
    expect(entries.length).toBe(2);
  });
});
