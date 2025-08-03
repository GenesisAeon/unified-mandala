import fs from 'fs';
import { parse } from 'yaml';

test('sigillin skeleton has modules list', () => {
  const file = fs.readFileSync('tasks/sigillin_skeleton.yaml', 'utf8');
  const data = parse(file) as any;
  expect(Array.isArray(data.modules)).toBe(true);
});
