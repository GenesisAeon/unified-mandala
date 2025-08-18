const fs = require('fs');
const path = require('path');
const { listOpenAdvancedTodos } = require('./list-open-advanced-todos');

function updateAdvancedProgress(limit = 5, progressFile, pattern) {
  const progressPath = progressFile || path.resolve(__dirname, '..', 'advancedprogress.json');
  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  const todos = listOpenAdvancedTodos(pattern).slice(0, limit);
  progress.pendingTasks = todos.map((t) => `${t.commit} (${t.path})`);
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  console.log(`Synced ${todos.length} tasks to ${progressPath}`);
}

if (require.main === module) {
  const limit = parseInt(process.argv[2], 10) || 5;
  const grepIndex = process.argv.indexOf('--grep');
  const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;
  updateAdvancedProgress(limit, undefined, pattern);
}

module.exports = { updateAdvancedProgress };
