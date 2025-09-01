const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
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

test('cli outputs json when --json flag is provided', () => {
  const tmp = path.join(__dirname, 'tmp-report.json');
  const sample = [
    { commit: 'Task A', path: 'a/file1', status: 'open' },
    { commit: 'Task C', path: 'b/file3', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const script = path.join(__dirname, '..', 'advanced-todo-report.js');
  const out = execSync(`node ${script} --path ${tmp} --json`, {
    encoding: 'utf8'
  });
  const grouped = JSON.parse(out);
  expect(grouped).toEqual({
    a: [{ commit: 'Task A', path: 'a/file1' }],
    b: [{ commit: 'Task C', path: 'b/file3' }]
  });

  fs.unlinkSync(tmp);
});

test('cli outputs yaml when --yaml flag is provided', () => {
  const tmp = path.join(__dirname, 'tmp-report.json');
  const sample = [
    { commit: 'Task A', path: 'a/file1', status: 'open' },
    { commit: 'Task C', path: 'b/file3', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const script = path.join(__dirname, '..', 'advanced-todo-report.js');
  const out = execSync(`node ${script} --path ${tmp} --yaml`, {
    encoding: 'utf8'
  });
  const grouped = yaml.load(out);
  expect(grouped).toEqual({
    a: [{ commit: 'Task A', path: 'a/file1' }],
    b: [{ commit: 'Task C', path: 'b/file3' }]
  });

  fs.unlinkSync(tmp);
});

test('cli outputs markdown when --md flag is provided', () => {
  const tmp = path.join(__dirname, 'tmp-report.json');
  const sample = [
    { commit: 'Task A', path: 'a/file1', status: 'open' },
    { commit: 'Task C', path: 'b/file3', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const script = path.join(__dirname, '..', 'advanced-todo-report.js');
  const out = execSync(`node ${script} --path ${tmp} --md`, {
    encoding: 'utf8'
  });
  expect(out).toContain('### a (1)');
  expect(out).toContain('- Task A');
  expect(out).toContain('### b (1)');
  expect(out).toContain('- Task C');

  fs.unlinkSync(tmp);
});
