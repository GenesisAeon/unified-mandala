import { extractKeywordTodos } from '../extract-keyword-todos';
import fs from 'fs';
import path from 'path';

test('extractKeywordTodos finds keywords', () => {
  const file = path.join(__dirname, 'sample.json');
  fs.writeFileSync(file, JSON.stringify([{mapping:{a:{message:{content:{parts:['Pantheon test']}}}}}]));
  const res = extractKeywordTodos(file, ['Pantheon']);
  expect(res[0]).toContain('Pantheon');
  fs.unlinkSync(file);
});
