const fs = require('fs');
const path = require('path');
const { parseMdTodos } = require('../parse-md-todos');

test('parses markdown checkbox todos', () => {
  const file = path.join(__dirname, 'sample.md');
  fs.writeFileSync(file, '- [ ] open task\n- [x] done task\n');
  const tasks = parseMdTodos(file);
  expect(tasks).toEqual([
    { text: 'open task', done: false },
    { text: 'done task', done: true }
  ]);
  fs.unlinkSync(file);
});
