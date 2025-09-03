const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');
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

test('combines tasks from multiple JSON and YAML files', () => {
  const tmpJson = path.join(__dirname, 'tmp-advancedToDo.json');
  const tmpYaml = path.join(__dirname, 'tmp-advancedToDo.yaml');
  const jsonSample = [{ commit: 'Task A', path: 'a', status: 'open' }];
  const yamlSample = [{ commit: 'Task B', path: 'b', status: 'open' }];
  fs.writeFileSync(tmpJson, JSON.stringify(jsonSample, null, 2));
  fs.writeFileSync(tmpYaml, yaml.dump(yamlSample));

  const todos = listOpenAdvancedTodos(undefined, [tmpJson, tmpYaml]);
  expect(todos).toEqual([
    { commit: 'Task A', path: 'a' },
    { commit: 'Task B', path: 'b' }
  ]);

  fs.unlinkSync(tmpJson);
  fs.unlinkSync(tmpYaml);
});

test('reads tasks from directory of part files', () => {
  const tmpDir = path.join(__dirname, 'tmp-parts');
  fs.mkdirSync(tmpDir);
  const part1 = [{ commit: 'Part A', path: 'pa', status: 'open' }];
  const part2 = [{ commit: 'Part B', path: 'pb', status: 'open' }];
  fs.writeFileSync(path.join(tmpDir, 'part1.json'), JSON.stringify(part1, null, 2));
  fs.writeFileSync(path.join(tmpDir, 'part2.yaml'), yaml.dump(part2));

  const todos = listOpenAdvancedTodos(undefined, tmpDir);
  expect(todos).toEqual([
    { commit: 'Part A', path: 'pa' },
    { commit: 'Part B', path: 'pb' }
  ]);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('recurses into nested directories', () => {
  const tmpDir = path.join(__dirname, 'tmp-nested');
  const nested = path.join(tmpDir, 'inner');
  fs.mkdirSync(nested, { recursive: true });
  const sample = [{ commit: 'Nested Task', path: 'inner/task', status: 'open' }];
  fs.writeFileSync(path.join(nested, 'todo.json'), JSON.stringify(sample, null, 2));

  const todos = listOpenAdvancedTodos(undefined, tmpDir);
  expect(todos).toEqual([{ commit: 'Nested Task', path: 'inner/task' }]);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('excludes tasks matching pattern', () => {
  const tmp = path.join(__dirname, 'tmp-exclude.json');
  const sample = [
    { commit: 'Keep me', path: 'a', status: 'open' },
    { commit: 'Skip this conversation task', path: 'conversations/b', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const todos = listOpenAdvancedTodos(undefined, tmp, 'conversations');
  expect(todos).toEqual([{ commit: 'Keep me', path: 'a' }]);

  fs.unlinkSync(tmp);
});

test('deduplicates tasks with same commit and path', () => {
  const tmp = path.join(__dirname, 'tmp-dup.json');
  const sample = [
    { commit: 'Task A', path: 'a', status: 'open' },
    { commit: 'Task A', path: 'a', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));

  const todos = listOpenAdvancedTodos(undefined, tmp);
  expect(todos).toEqual([{ commit: 'Task A', path: 'a' }]);

  fs.unlinkSync(tmp);
});

test('CLI outputs JSON format', () => {
  const tmp = path.join(__dirname, 'tmp-cli.json');
  const sample = [
    { commit: 'Task A', path: 'a', status: 'open' },
    { commit: 'Task B', path: 'b', status: 'open' }
  ];
  fs.writeFileSync(tmp, JSON.stringify(sample, null, 2));
  const script = path.join(__dirname, '..', 'list-open-advanced-todos.js');
  const output = execSync(`node ${script} 5 --path ${tmp} --json`, {
    encoding: 'utf8'
  });
  const parsed = JSON.parse(output);
  expect(parsed.todos).toEqual([
    { commit: 'Task A', path: 'a' },
    { commit: 'Task B', path: 'b' }
  ]);
  fs.unlinkSync(tmp);
});
