import fs from 'fs';
import path from 'path';
import os from 'os';
import { syncTodoProgress } from '../sync-todo-progress';

test('syncTodoProgress reports counts and supports dry run', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-test-'));
  const partsDir = path.join(tmp, 'parts');
  fs.mkdirSync(partsDir);
  const tasks = [
    { commit: 'done task', status: 'done' },
    { commit: 'pending task', status: 'open' }
  ];
  fs.writeFileSync(
    path.join(partsDir, 'tasks.json'),
    JSON.stringify(tasks, null, 2)
  );
  const progressFile = path.join(tmp, 'progress.json');
  fs.writeFileSync(progressFile, JSON.stringify({ progress: [], pendingTasks: [] }, null, 2));

  const dry = syncTodoProgress(partsDir, progressFile, [], { dryRun: true });
  expect(dry.addedDone).toBe(1);
  expect(dry.addedPending).toBe(1);
  const afterDry = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  expect(afterDry.progress).toHaveLength(0);

  const run = syncTodoProgress(partsDir, progressFile);
  expect(run.addedDone).toBe(1);
  expect(run.addedPending).toBe(1);
  const final = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  expect(final.progress).toHaveLength(1);
  expect(final.pendingTasks).toHaveLength(1);
});
