import fs from 'fs';
import path from 'path';
import { archiveOldTodos } from './ArchiveOldTodos';

test('creates gz archive', () => {
  const tmpDir = fs.mkdtempSync('todo');
  const file = path.join(tmpDir, 'todos.json');
  fs.writeFileSync(file, '[1]');
  const out = archiveOldTodos(file, tmpDir);
  expect(fs.existsSync(out)).toBe(true);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
