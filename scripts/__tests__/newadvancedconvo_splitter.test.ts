import fs from 'fs';
import path from 'path';
const { split } = require('../newadvancedconvo_splitter');

test('split creates conversation fragments', async () => {
  const tmp = fs.mkdtempSync(path.join(__dirname, 'conv-'));
  const src = path.join(tmp, 'in.json');
  fs.writeFileSync(src, JSON.stringify([{ title: 'Alpha' }, { title: 'Beta' }]));
  const dest = path.join(tmp, 'out');
  const count = await split(src, dest);
  expect(fs.existsSync(path.join(dest, 'Alpha', 'conversation.json'))).toBe(true);
  expect(fs.existsSync(path.join(dest, 'Beta', 'conversation.json'))).toBe(true);
  expect(count).toBe(2);
  fs.rmSync(tmp, { recursive: true, force: true });
});
