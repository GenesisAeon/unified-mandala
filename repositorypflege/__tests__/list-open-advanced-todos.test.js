const { listOpenAdvancedTodos } = require('../list-open-advanced-todos');

test('lists open advanced todos', () => {
  const todos = listOpenAdvancedTodos();
  expect(Array.isArray(todos)).toBe(true);
  expect(todos.length).toBeGreaterThan(0);
  todos.forEach(todo => {
    expect(todo).toHaveProperty('commit');
    expect(todo).toHaveProperty('path');
  });
});
