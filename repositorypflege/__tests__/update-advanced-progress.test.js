const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
jest.mock('../list-open-advanced-todos', () => ({
  listOpenAdvancedTodos: jest.fn()
}));
const { updateAdvancedProgress } = require('../update-advanced-progress');
const { listOpenAdvancedTodos } = require('../list-open-advanced-todos');

test('updates pendingTasks with limited todos', () => {
  const tmp = path.join(__dirname, 'tmp-progress.json');
  fs.writeFileSync(tmp, JSON.stringify({ pendingTasks: [] }, null, 2));

  listOpenAdvancedTodos.mockReturnValue([
    { commit: 'Task A', path: 'a' },
    { commit: 'Task B', path: 'b' },
    { commit: 'Task C', path: 'c' }
  ]);

  updateAdvancedProgress(2, tmp);
  const updated = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  expect(updated.pendingTasks).toEqual([
    { commit: 'Task A', path: 'a', status: 'open' },
    { commit: 'Task B', path: 'b', status: 'open' }
  ]);
  expect(typeof updated.lastUpdated).toBe('string');
  expect(isNaN(Date.parse(updated.lastUpdated))).toBe(false);
});

test('forwards exclude pattern to listOpenAdvancedTodos', () => {
  const tmp = path.join(__dirname, 'tmp-progress.json');
  fs.writeFileSync(tmp, JSON.stringify({ pendingTasks: [] }, null, 2));
  listOpenAdvancedTodos.mockClear();
  listOpenAdvancedTodos.mockReturnValue([]);

  updateAdvancedProgress(5, tmp, undefined, undefined, 'conversations');
  expect(listOpenAdvancedTodos).toHaveBeenCalledWith(
    undefined,
    undefined,
    'conversations'
  );
});

test('cli writes to provided progress file', () => {
  const tmpProgress = path.join(__dirname, 'cli-progress.json');
  const tmpTodo = path.join(__dirname, 'cli-todo.json');
  fs.writeFileSync(tmpProgress, JSON.stringify({ pendingTasks: [] }, null, 2));
  fs.writeFileSync(
    tmpTodo,
    JSON.stringify([{ commit: 'CLI Task', path: 'cli', status: 'open' }], null, 2)
  );
  const script = path.join(__dirname, '..', 'update-advanced-progress.js');
  execSync(`node ${script} 5 --file ${tmpProgress} --path ${tmpTodo}`);
  const updated = JSON.parse(fs.readFileSync(tmpProgress, 'utf8'));
  expect(updated.pendingTasks).toEqual([
    { commit: 'CLI Task', path: 'cli', status: 'open' }
  ]);
  fs.unlinkSync(tmpProgress);
  fs.unlinkSync(tmpTodo);
});
