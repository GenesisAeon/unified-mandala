import fs from 'fs';
import yaml from 'yaml';
import { generateTodos } from './generate-todo-from-convos';

test('extracts todos with priority and sorts', () => {
  const tmpJson = 'tmp-convos.json';
  const conv = [
    {
      mapping: {
        a: { message: { content: { parts: ['Wir sollten Test 1 CREP: 0.8'] } } },
        b: { message: { content: { parts: ['TODO implement feature CREP:0.2'] } } },
      },
    },
  ];
  fs.writeFileSync(tmpJson, JSON.stringify(conv));
  const out = 'tmp-todos.yaml';
  generateTodos([tmpJson], out);
  const parsed = yaml.parse(fs.readFileSync(out, 'utf-8')) as any[];
  fs.unlinkSync(tmpJson);
  fs.unlinkSync(out);
  expect(parsed[0].priority).toBeGreaterThan(parsed[1].priority);
  expect(parsed.length).toBe(2);
});
