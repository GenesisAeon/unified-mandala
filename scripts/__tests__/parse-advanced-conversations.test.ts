import fs from 'fs';
import path from 'path';
const {
  parseAdvancedConversations,
  extractTodosFromVoiceNote,
} = require('../parse-advanced-conversations');

test('parseAdvancedConversations extracts TODO fragments', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp'));
  const file = path.join(tmpDir, 'convos.json');
  const dest = path.join(tmpDir, 'out');
  const data = [{ msg: 'hello' }, { msg: 'TODO: test' }];
  fs.writeFileSync(file, JSON.stringify(data));
  const matches = parseAdvancedConversations(file, dest, 'TODO');
  expect(matches.length).toBe(1);
  const out = fs.readFileSync(path.join(dest, 'convos-grep.json'), 'utf8');
  expect(out.includes('test')).toBe(true);
  fs.rmSync(tmpDir, { recursive: true });
});

test('extractTodosFromVoiceNote converts TODO lines', () => {
  const transcript = 'random line\nTODO: finish docs\nAnother';
  const tasks = extractTodosFromVoiceNote(transcript);
  expect(tasks).toHaveLength(1);
  expect(tasks[0].task).toBe('finish docs');
});
