const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function listOpenAdvancedTodos(
  jsonPath = path.resolve(__dirname, '..', 'advancedToDo.json'),
  yamlPath = path.resolve(__dirname, '..', 'advancedToDo.yaml')
) {
  const items = [];

  if (fs.existsSync(jsonPath)) {
    try {
      const rawJson = fs.readFileSync(jsonPath, 'utf-8');
      const jsonData = JSON.parse(rawJson);
      if (Array.isArray(jsonData)) items.push(...jsonData);
    } catch {
      // ignore parse errors
    }
  }

  if (fs.existsSync(yamlPath)) {
    try {
      const rawYaml = fs.readFileSync(yamlPath, 'utf-8');
      const yamlData = yaml.load(rawYaml);
      if (Array.isArray(yamlData)) items.push(...yamlData);
    } catch {
      // ignore parse errors
    }
  }

  return items
    .filter(item => item.status !== 'done')
    .map(item => ({ commit: item.commit, path: item.path }));
}

if (require.main === module) {
  const open = listOpenAdvancedTodos();
  const display = open.slice(0, 5);
  display.forEach(t => {
    const commitText = (typeof t.commit === 'string' && t.commit.length > 120)
      ? t.commit.slice(0, 117) + '...'
      : t.commit;
    console.log(`- ${commitText} (${t.path})`);
  });
  if (open.length > 5) {
    console.log(`...and ${open.length - 5} more`);
  }
}

module.exports = { listOpenAdvancedTodos };
