const fs = require('fs');
const path = require('path');
const { listOpenAdvancedTodos } = require('../list-open-advanced-todos');

test('lists and filters open advanced todos', () => {
  const tmp = path.join(__dirname, 'tmp-advancedToDo.json');
  const sample = [
    { commit: 'Task A', path: 'a', status: 'open' },
    { commit: 'Task B', path: 'b', status: 'done' },
    { commit: '', path: 'c', status: 'open' },
    { commit: 'Test C', path: 'c', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const todos = listOpenAdvancedTodos('Test', tmp);
  expect(todos).toEqual([{ commit: 'Test C', path: 'c' }]);

  fs.unlinkSync(tmp);
});
