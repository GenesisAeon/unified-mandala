import fs from 'fs';
import { getOpenTasks } from './OpenTaskLister';

test('getOpenTasks filters tasks with status todo', () => {
  const tmp = 'tmp_open_tasks.yaml';
  fs.writeFileSync(tmp, '- task: a\n  status: todo\n- task: b\n  status: done\n');
  const tasks = getOpenTasks(tmp);
  expect(tasks).toHaveLength(1);
  expect(tasks[0].task).toBe('a');
  fs.unlinkSync(tmp);
});
