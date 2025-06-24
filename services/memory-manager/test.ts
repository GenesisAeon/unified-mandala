import { MemoryManager } from './index';
import fs from 'fs';
import path from 'path';

test('stores and retrieves entries', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  mm.add('daily', 'note');
  expect(mm.get('daily')).toEqual(['note']);
  mm.stop();
});

test('ingests fragments from file', () => {
  const tmp = path.join(__dirname, '__tmp.txt');
  fs.writeFileSync(tmp, 'a\nb');
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  mm.ingestFragments([tmp]);
  expect(mm.get('daily')).toEqual(['a', 'b']);
  fs.unlinkSync(tmp);
  mm.stop();
});
