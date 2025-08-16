const { execSync } = require('child_process');
const path = require('path');
const { listOpenAdvancedTodos } = require('../list-open-advanced-todos');

test('lists open advanced todos', () => {
  const todos = listOpenAdvancedTodos();
  expect(Array.isArray(todos)).toBe(true);
  expect(todos.length).toBeGreaterThan(0);
  todos.forEach((todo) => {
    expect(todo).toHaveProperty('commit');
    expect(todo).toHaveProperty('path');
  });
});

test('respects limit parameter', () => {
  const limited = listOpenAdvancedTodos(2);
  expect(limited.length).toBe(2);
});

test('cli supports json output', () => {
  const script = path.resolve(__dirname, '../list-open-advanced-todos.js');
  const out = execSync(`node ${script} 1 --json`, { encoding: 'utf8' });
  const parsed = JSON.parse(out);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.length).toBe(1);
});
