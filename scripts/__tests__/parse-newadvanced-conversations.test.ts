import fs from 'fs';
import path from 'path';
const {
  parseNewAdvancedConversations,
  extractSessionTodos,
} = require('../parse-newadvanced-conversations');

test('parseNewAdvancedConversations extracts TODO fragments', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp'));
  const file = path.join(tmpDir, 'convos.json');
  const dest = path.join(tmpDir, 'out');
  const data = [
    { msg: 'hello' },
    { msg: 'TODO: add feature' }
  ];
  fs.writeFileSync(file, JSON.stringify(data));
  const matches = parseNewAdvancedConversations(file, dest, 'TODO');
  expect(matches.length).toBe(1);
  const out = fs.readFileSync(path.join(dest, 'convos-grep.json'), 'utf8');
  expect(out.includes('add feature')).toBe(true);
  fs.rmSync(tmpDir, { recursive: true });
});

test('extractSessionTodos filters by titles and finds tasks', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-todo-'));
  const file = path.join(tmpDir, 'convos.json');
  const data = [
    {
      title: 'Keep',
      mapping: {
        a: {
          message: { content: { parts: ['TODO: first task'] }, author: {} },
        },
      },
    },
    {
      title: 'Skip',
      mapping: {
        b: {
          message: { content: { parts: ['TODO: should not appear'] }, author: {} },
        },
      },
    },
  ];
  fs.writeFileSync(file, JSON.stringify(data));
  const tasks = extractSessionTodos(file, ['Keep']);
  expect(tasks).toHaveLength(1);
  expect(tasks[0].commit).toContain('first task');
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
