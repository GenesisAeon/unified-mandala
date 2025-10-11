const path = require('path');
const yaml = require('js-yaml');
const { listOpenAdvancedTodos } = require('./list-open-advanced-todos');

function groupTodosByDir(pattern, todoPaths, excludePattern, includeConversations = false) {
  const todos = listOpenAdvancedTodos(pattern, todoPaths, excludePattern, {
    includeConversations,
  });
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
  const markdownOutput = process.argv.includes('--markdown') || process.argv.includes('--md');
  const includeConvos = process.argv.includes('--include-conversations');
  const limitIndex = process.argv.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(process.argv[limitIndex + 1], 10) : undefined;
  const sortIndex = process.argv.indexOf('--sort');
  const sortMode = sortIndex >= 0 ? process.argv[sortIndex + 1] : 'alpha';

  const grouped = groupTodosByDir(pattern, todoPaths, exclude, includeConvos);
  if (yamlOutput) {
    console.log(yaml.dump(grouped));
  } else if (jsonOutput) {
    console.log(JSON.stringify(grouped, null, 2));
  } else if (markdownOutput) {
    let total = 0;
    const entries = Object.entries(grouped);
    entries.sort((a, b) => {
      if (sortMode === 'count') {
        return b[1].length - a[1].length;
      }
      return a[0].localeCompare(b[0]);
    });
    for (const [dir, tasks] of entries) {
      total += tasks.length;
      console.log(`### ${dir} (${tasks.length})`);
      const list = limit ? tasks.slice(0, limit) : tasks;
      list.forEach((t) => console.log(`- ${t.commit}`));
      if (limit && tasks.length > limit) {
        console.log(`- ...and ${tasks.length - limit} more`);
      }
      console.log('');
    }
    console.log(`Total open tasks: ${total}`);
  } else {
    let total = 0;
    const entries = Object.entries(grouped);
    entries.sort((a, b) => {
      if (sortMode === 'count') {
        return b[1].length - a[1].length;
      }
      return a[0].localeCompare(b[0]);
    });
    for (const [dir, tasks] of entries) {
      total += tasks.length;
      console.log(`${dir} (${tasks.length}):`);
      const list = limit ? tasks.slice(0, limit) : tasks;
      list.forEach((t) => console.log(`  - ${t.commit}`));
      if (limit && tasks.length > limit) {
        console.log(`  ...and ${tasks.length - limit} more`);
      }
    }
    console.log(`Total open tasks: ${total}`);
  }
}

module.exports = { groupTodosByDir };
