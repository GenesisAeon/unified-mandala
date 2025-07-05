import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const script = path.join(__dirname, '../split-advanced-conversations.js');

test('splits conversations into chunks', () => {
  const src = path.join(__dirname, '__conv.json');
  const dest = path.join(__dirname, '__out');
  fs.writeFileSync(src, JSON.stringify([{a:1},{b:2}], null, 2));
  execSync(`node ${script} 1`, { env: { ...process.env, ADV_SRC: src, ADV_DEST: dest } });
  const files = fs.readdirSync(dest).filter(f => f.endsWith('.json'));
  expect(files.length).toBe(2);
  fs.rmSync(src);
  fs.rmSync(dest, { recursive: true, force: true });
});
