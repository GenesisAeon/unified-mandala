const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
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
