const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { listOpenAdvancedTodos } = require('./list-open-advanced-todos');

function getChangedFiles() {
  try {
    const output = execSync('git status --porcelain').toString();
    return output
      .split('\n')
      .filter(Boolean)
      .map((line) => line.slice(3).trim());
  } catch {
    return [];
  }
}

function getCommitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return null;
  }
}

function updateAdvancedProgress(
  limit = 5,
  progressFile,
  pattern,
  todoPaths,
  excludePattern,
  { includeConversations = false, dryRun = false } = {}
) {
  const progressPath = progressFile || path.resolve(__dirname, '..', 'advancedprogress.json');
  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  const todos = listOpenAdvancedTodos(pattern, todoPaths, excludePattern, {
    includeConversations
  }).slice(0, limit);
  progress.pendingTasks = todos.map((t) => ({ commit: t.commit, path: t.path, status: 'open' }));
  const changed = getChangedFiles().filter(
    (f) => f !== path.relative(path.resolve(__dirname, '..'), progressPath)
  );
  progress.changedFiles = changed;
  progress.lastUpdated = new Date().toISOString();
  const commit = getCommitHash();
  if (commit) {
    progress.commitHash = commit;
  }
  const output = JSON.stringify(progress, null, 2);
  if (dryRun) {
    console.log(output);
  } else {
    fs.writeFileSync(progressPath, output);
    console.log(`Synced ${todos.length} tasks to ${progressPath}`);
  }
}

if (require.main === module) {
  const limit = parseInt(process.argv[2], 10) || 5;
  const grepIndex = process.argv.indexOf('--grep');
  const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;
  const pathIndex = process.argv.indexOf('--path');
  const pathArg = pathIndex >= 0 ? process.argv[pathIndex + 1] : undefined;
  const todoPaths = pathArg ? pathArg.split(',') : undefined;
  const exclIndex = process.argv.indexOf('--exclude');
  const exclude = exclIndex >= 0 ? process.argv[exclIndex + 1] : undefined;
  const fileIndex = process.argv.indexOf('--file');
  const progressFile = fileIndex >= 0 ? process.argv[fileIndex + 1] : undefined;
  const includeConvos = process.argv.includes('--include-conversations');
  const dryRun = process.argv.includes('--dry-run');
  updateAdvancedProgress(limit, progressFile, pattern, todoPaths, exclude, {
    includeConversations: includeConvos,
    dryRun
  });
}

module.exports = { updateAdvancedProgress };
