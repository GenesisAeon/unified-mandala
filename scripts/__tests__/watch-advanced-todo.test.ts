import fs from 'fs';
import path from 'path';
import { test } from 'vitest';
import { watchAdvancedToDo } from '../watch-advanced-todo';

test('watchAdvancedToDo detects file changes', (ctx) => {
  const tmp = path.join(__dirname, '__tmp-todo.json');
  fs.writeFileSync(tmp, '[]');
  return new Promise<void>((resolve) => {
    const stop = watchAdvancedToDo(tmp, 50, () => {
      stop();
      fs.unlinkSync(tmp);
      resolve();
    });
    setTimeout(() => {
      fs.writeFileSync(tmp, '[1]');
    }, 100);
  });
});
