const fs = require('fs');
const path = require('path');

function listOpenAdvancedTodos() {
  const todoPath = path.resolve(__dirname, '..', 'advancedToDo.json');
  const raw = fs.readFileSync(todoPath, 'utf-8');
  const data = JSON.parse(raw);
  return data.filter(item => item.status !== 'done')
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
