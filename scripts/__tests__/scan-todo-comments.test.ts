import fs from 'fs';
import path from 'path';

jest.mock('../../packages/shared-utils/todoCommentScanner', () => ({
  scanTodoComments: () => [{ text: 'todo', file: 'a.ts', line: 1 }],
}));

jest.mock('../../packages/shared-utils/todoSigilGenerator', () => ({
  createTodoSigil: () => 'yaml',
}));

const { run } = require('../scan-todo-comments');

test('writes sigil file', () => {
  const sigil = path.join(__dirname, '../../docs/sigils/todo-sigil.yaml');
  const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  run();
  expect(spy).toHaveBeenCalledWith(sigil, 'yaml');
  spy.mockRestore();
});
