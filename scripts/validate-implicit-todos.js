const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const yamlPath = process.argv[2] || path.join(__dirname, '../advancedToDo.yaml');
const jsonPath = process.argv[3] || path.join(__dirname, '../advancedToDo.json');

function loadTodos(file, parser) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return parser(content);
  } catch (err) {
    console.error(`Unable to read ${file}:`, err.message);
    process.exitCode = 1;
    return [];
  }
}

function validateList(list, source) {
  const errors = [];
  const seen = new Set();
  list.forEach((item, idx) => {
    ['commit', 'path', 'task', 'test'].forEach(key => {
      if (!item[key] || typeof item[key] !== 'string' || !item[key].trim()) {
        errors.push(`${source}[${idx}] missing ${key}`);
      }
    });
    const id = item.commit || item.task;
    if (seen.has(id)) {
      errors.push(`${source}[${idx}] duplicate entry ${id}`);
    }
    seen.add(id);
  });
  return { errors, seen };
}

const yamlTodos = loadTodos(yamlPath, YAML.parse);
const jsonTodos = loadTodos(jsonPath, JSON.parse);

const yamlCheck = validateList(yamlTodos, 'yaml');
const jsonCheck = validateList(jsonTodos, 'json');

const errors = [...yamlCheck.errors, ...jsonCheck.errors];

if (yamlTodos.length !== jsonTodos.length) {
  errors.push(`mismatched lengths yaml(${yamlTodos.length}) vs json(${jsonTodos.length})`);
}

for (const id of jsonCheck.seen) {
  if (!yamlCheck.seen.has(id)) {
    errors.push(`missing in yaml: ${id}`);
  }
}
for (const id of yamlCheck.seen) {
  if (!jsonCheck.seen.has(id)) {
    errors.push(`missing in json: ${id}`);
  }
}

if (errors.length) {
  console.error('Validation errors:\n' + errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All advancedToDo entries look valid');
}
