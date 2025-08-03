const fs = require('fs');
const path = require('path');

function syncTodoProgress(partsDir, progressFile) {
  const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  progress.progress = progress.progress || [];
  progress.pendingTasks = progress.pendingTasks || [];

  const doneSet = new Set(progress.progress.map(p => p.commit));
  const pendingSet = new Set(progress.pendingTasks.map(p => p.commit));

  const files = fs.readdirSync(partsDir).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const tasks = JSON.parse(fs.readFileSync(path.join(partsDir, file), 'utf8'));
    tasks.forEach(task => {
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
  syncTodoProgress(partsDir, progressFile);
  console.log('Synchronized ToDo parts with progress file');
}

module.exports = { syncTodoProgress };
