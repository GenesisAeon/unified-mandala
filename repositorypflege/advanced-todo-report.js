const path = require('path');
const yaml = require('js-yaml');
const { listOpenAdvancedTodos } = require('./list-open-advanced-todos');

function groupTodosByDir(pattern, todoPaths, excludePattern) {
  const todos = listOpenAdvancedTodos(pattern, todoPaths, excludePattern);
  return todos.reduce((acc, t) => {
    const dir = path.dirname(t.path || '').replace(/\\/g, '/');
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(t);
    return acc;
  }, {});
}

if (require.main === module) {
  const grepIndex = process.argv.indexOf('--grep');
  const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;
  const pathIndex = process.argv.indexOf('--path');
  const todoPaths = pathIndex >= 0 ? process.argv[pathIndex + 1].split(',') : undefined;
  const exclIndex = process.argv.indexOf('--exclude');
  const exclude = exclIndex >= 0 ? process.argv[exclIndex + 1] : undefined;
  const jsonOutput = process.argv.includes('--json');
  const yamlOutput = process.argv.includes('--yaml');

  const grouped = groupTodosByDir(pattern, todoPaths, exclude);
  if (yamlOutput) {
    console.log(yaml.dump(grouped));
  } else if (jsonOutput) {
    console.log(JSON.stringify(grouped, null, 2));
  } else {
    for (const [dir, tasks] of Object.entries(grouped)) {
      console.log(`${dir}:`);
      tasks.forEach((t) => console.log(`  - ${t.commit}`));
    }
  }
}

module.exports = { groupTodosByDir };
