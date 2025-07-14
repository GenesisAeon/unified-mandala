import fs from 'fs';
import path from 'path';
const { parseNewAdvancedConversations } = require('../parse-newadvanced-conversations');

test('parseNewAdvancedConversations extracts TODO fragments', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp'));
  const file = path.join(tmpDir, 'convos.json');
  const dest = path.join(tmpDir, 'out');
  const data = [
    { msg: 'hello' },
    { msg: 'TODO: add feature' }
  ];
  fs.writeFileSync(file, JSON.stringify(data));
  const matches = parseNewAdvancedConversations(file, dest, 'TODO');
  expect(matches.length).toBe(1);
  const out = fs.readFileSync(path.join(dest, 'convos-grep.json'), 'utf8');
  expect(out.includes('add feature')).toBe(true);
  fs.rmSync(tmpDir, { recursive: true });
});
