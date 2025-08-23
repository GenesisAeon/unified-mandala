const path = require('path');
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

  const grouped = groupTodosByDir(pattern, todoPaths, exclude);
  for (const [dir, tasks] of Object.entries(grouped)) {
    console.log(`${dir}:`);
    tasks.forEach((t) => console.log(`  - ${t.commit}`));
  }
}

module.exports = { groupTodosByDir };
