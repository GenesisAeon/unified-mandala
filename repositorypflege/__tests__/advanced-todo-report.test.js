const fs = require('fs');
const path = require('path');
const { groupTodosByDir } = require('../advanced-todo-report');

test('groups open todos by directory', () => {
  const tmp = path.join(__dirname, 'tmp-report.json');
  const sample = [
    { commit: 'Task A', path: 'a/file1', status: 'open' },
    { commit: 'Task B', path: 'a/file2', status: 'open' },
    { commit: 'Task C', path: 'b/file3', status: 'open' },
    { commit: 'Task D', path: 'b/file4', status: 'done' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const grouped = groupTodosByDir(undefined, tmp);
  expect(grouped).toEqual({
    a: [
      { commit: 'Task A', path: 'a/file1' },
      { commit: 'Task B', path: 'a/file2' }
    ],
    b: [
      { commit: 'Task C', path: 'b/file3' }
    ]
  });

  fs.unlinkSync(tmp);
});
