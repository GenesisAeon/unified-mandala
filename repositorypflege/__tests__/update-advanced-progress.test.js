const fs = require('fs');
const path = require('path');
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
});
