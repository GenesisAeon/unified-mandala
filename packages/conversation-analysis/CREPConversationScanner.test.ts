import fs from 'fs';
import { scanConversations } from './CREPConversationScanner';

test('counts conversation entries', () => {
  const tmp = 'tmp-convos.json';
  fs.writeFileSync(tmp, JSON.stringify([{text:'a'}, {text:'b'}, {text:'c'}]));
  const report = scanConversations(tmp);
  fs.unlinkSync(tmp);
  expect(report.total).toBe(3);
});
