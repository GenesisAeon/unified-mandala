const fs = require('fs');
const YAML = require('yaml');

function loadAdvancedTodo(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    const list = YAML.parse(data);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function getOpenTasks(file) {
  return loadAdvancedTodo(file).filter((t) => t.status === 'todo');
}

module.exports = { loadAdvancedTodo, getOpenTasks };
