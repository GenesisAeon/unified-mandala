import fs from 'fs';
import { weaveTodos } from './ToDoWeaver';

test('weaveTodos writes yaml file', () => {
  const tmp = 'tmp_todo.yaml';
  weaveTodos(['a', 'b'], tmp);
  const content = fs.readFileSync(tmp, 'utf8');
  expect(content).toContain('task-0');
  fs.unlinkSync(tmp);
});
