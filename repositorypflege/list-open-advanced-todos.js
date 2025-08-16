const fs = require('fs');
const path = require('path');

function listOpenAdvancedTodos(limit = Infinity) {
  const todoPath = path.resolve(__dirname, '..', 'advancedToDo.json');
  const raw = fs.readFileSync(todoPath, 'utf-8');
  const data = JSON.parse(raw);
  return data
    .filter((item) => item.status !== 'done')
    .slice(0, limit)
    .map((item) => ({ commit: item.commit, path: item.path }));
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes('--json');
  const limitArg = args.find((a) => /^\d+$/.test(a));
  const limit = limitArg ? parseInt(limitArg, 10) : 5;
  const todos = listOpenAdvancedTodos(limit);

  if (jsonFlag) {
    console.log(JSON.stringify(todos, null, 2));
  } else {
    todos.forEach((t) => {
      const commitText =
        typeof t.commit === 'string' && t.commit.length > 120
          ? t.commit.slice(0, 117) + '...'
          : t.commit;
      console.log(`- ${commitText} (${t.path})`);
    });
    const remaining = listOpenAdvancedTodos().length - todos.length;
    if (remaining > 0) {
      console.log(`...and ${remaining} more`);
    }
  }
}

module.exports = { listOpenAdvancedTodos };
