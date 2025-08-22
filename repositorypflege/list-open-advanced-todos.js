const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function readTodoFile(file) {
  const raw = fs.readFileSync(file, 'utf-8');
  const ext = path.extname(file).toLowerCase();
  return ext === '.yaml' || ext === '.yml' ? yaml.load(raw) : JSON.parse(raw);
}

function listOpenAdvancedTodos(pattern, todoPaths) {
  const files =
    todoPaths && todoPaths.length
      ? Array.isArray(todoPaths)
        ? todoPaths
        : [todoPaths]
      : [
          path.resolve(__dirname, '..', 'advancedToDo.json'),
          path.resolve(__dirname, '..', 'advancedToDo.yaml')
        ];
  let data = [];
  for (const file of files) {
    if (fs.existsSync(file)) {
      data = data.concat(readTodoFile(file));
    }
  }
  const regex = pattern ? new RegExp(pattern, 'i') : null;
  const seen = new Set();
  const result = [];
  for (const item of data) {
    if (
      item.status !== 'done' &&
      item.commit &&
      item.path &&
      (!regex || regex.test(item.commit) || regex.test(item.path))
    ) {
      const key = `${item.commit}|${item.path}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ commit: item.commit, path: item.path });
      }
    }
  }
  return result;
}

if (require.main === module) {
  const limit = parseInt(process.argv[2], 10) || 5;
  const grepIndex = process.argv.indexOf('--grep');
  const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;
  const pathIndex = process.argv.indexOf('--path');
  const pathArg = pathIndex >= 0 ? process.argv[pathIndex + 1] : undefined;
  const todoPaths = pathArg ? pathArg.split(',') : undefined;
  const open = listOpenAdvancedTodos(pattern, todoPaths);
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
