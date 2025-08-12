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

function syncTodoProgress(partsDir, progressFile, extraFiles = []) {
  const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  progress.progress = progress.progress || [];
  progress.pendingTasks = progress.pendingTasks || [];

  const doneSet = new Set(progress.progress.map(p => p.commit));
  const pendingSet = new Set(progress.pendingTasks.map(p => p.commit));

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
        }
      } else {
        if (!pendingSet.has(task.commit)) {
          progress.pendingTasks.push({ commit: task.commit, status: task.status || 'open' });
          pendingSet.add(task.commit);
        }
      }
    });
  });

  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
  return progress;
}

if (require.main === module) {
  const partsDir = path.join(__dirname, '../advancedToDo_parts');
  const progressFile = path.join(__dirname, '../advancedprogress.json');
  const extra = [
    path.join(__dirname, '../advancedToDo.json'),
    path.join(__dirname, '../advancedToDo.yaml'),
  ];
  syncTodoProgress(partsDir, progressFile, extra);
  console.log('Synchronized ToDo parts with progress file');
}

module.exports = { syncTodoProgress, loadTasks };
