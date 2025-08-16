const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadTasks(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, 'utf8');
  if (ext === '.json') return JSON.parse(raw);
  if (ext === '.yaml' || ext === '.yml') return yaml.load(raw);
  return [];
}

function syncTodoProgress(partsDir, progressFile, extraFiles = [], options = {}) {
  const { dryRun = false } = options;
  const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  progress.progress = progress.progress || [];
  progress.pendingTasks = progress.pendingTasks || [];

  const doneSet = new Set(progress.progress.map(p => p.commit));
  const pendingSet = new Set(progress.pendingTasks.map(p => p.commit));

  let addedDone = 0;
  let addedPending = 0;

  const partFiles = fs
    .readdirSync(partsDir)
    .filter(f => ['.json', '.yaml', '.yml'].includes(path.extname(f)));

  const allFiles = partFiles.map(f => path.join(partsDir, f)).concat(extraFiles);

  allFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const tasks = loadTasks(file) || [];
    (tasks || []).forEach(task => {
      if (!task || !task.commit) return;
      if (task.status === 'done') {
        if (!doneSet.has(task.commit)) {
          progress.progress.push({ commit: task.commit, status: 'done' });
          doneSet.add(task.commit);
          addedDone++;
        }
      } else {
        if (!pendingSet.has(task.commit)) {
          progress.pendingTasks.push({ commit: task.commit, status: task.status || 'open' });
          pendingSet.add(task.commit);
          addedPending++;
        }
      }
    });
  });

  if (!dryRun) {
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
  }
  return { progress, addedDone, addedPending };
}

if (require.main === module) {
  const partsDir = path.join(__dirname, '../advancedToDo_parts');
  const progressFile = path.join(__dirname, '../advancedprogress.json');
  const extra = [
    path.join(__dirname, '../advancedToDo.json'),
    path.join(__dirname, '../advancedToDo.yaml'),
    path.join(__dirname, '../docs/sigils/implicit-todos.yaml'),
  ];
  const dryRun = process.argv.includes('--dry-run');
  const { addedDone, addedPending } = syncTodoProgress(partsDir, progressFile, extra, { dryRun });
  console.log(
    `Synchronized ToDo parts with progress file (added ${addedDone} done, ${addedPending} pending)`
  );
}

module.exports = { syncTodoProgress, loadTasks };
