const fs = require('fs');
const path = require('path');

function listOpenAdvancedTodos(pattern, todoPath) {
  const file = todoPath || path.resolve(__dirname, '..', 'advancedToDo.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  const regex = pattern ? new RegExp(pattern, 'i') : null;
  return data
    .filter(
      (item) =>
        item.status !== 'done' &&
        item.commit &&
        item.path &&
        (!regex || regex.test(item.commit) || regex.test(item.path))
    )
    .map((item) => ({ commit: item.commit, path: item.path }));
}

if (require.main === module) {
  const limit = parseInt(process.argv[2], 10) || 5;
  const grepIndex = process.argv.indexOf('--grep');
  const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;
  const open = listOpenAdvancedTodos(pattern);
  const display = open.slice(0, limit);
  display.forEach((t) => {
    const commitText =
      typeof t.commit === 'string' && t.commit.length > 120
        ? t.commit.slice(0, 117) + '...'
        : t.commit;
    console.log(`- ${commitText} (${t.path})`);
  });
  if (open.length > limit) {
    console.log(`...and ${open.length - limit} more`);
  }
}

module.exports = { listOpenAdvancedTodos };
