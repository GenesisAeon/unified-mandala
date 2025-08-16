const fs = require('fs');
const path = require('path');
const { listOpenAdvancedTodos } = require('../list-open-advanced-todos');

test('reads open todos from JSON and YAML', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'));
  const jsonFile = path.join(tmpDir, 'advancedToDo.json');
  const yamlFile = path.join(tmpDir, 'advancedToDo.yaml');

  const jsonData = [
    { commit: 'J task', path: 'a', status: 'todo' },
    { commit: 'done', path: 'b', status: 'done' }
  ];
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));

  const yamlData = `- commit: Y task\n  path: c\n  status: todo\n- commit: finished\n  path: d\n  status: done\n`;
  fs.writeFileSync(yamlFile, yamlData);

  const result = listOpenAdvancedTodos(jsonFile, yamlFile);
  expect(result).toEqual([
    { commit: 'J task', path: 'a' },
    { commit: 'Y task', path: 'c' }
  ]);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
