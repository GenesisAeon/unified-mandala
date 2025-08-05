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

test('clear removes data by category', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  mm.add('daily', 'foo');
  mm.add('weekly', 'bar');
  mm.clear('daily');
  expect(mm.get('daily')).toEqual([]);
  expect(mm.get('weekly')).toEqual(['bar']);
  mm.stop();
});

test('getCategories lists all categories', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  expect(mm.getCategories().sort()).toEqual(['daily', 'longterm', 'weekly']);
  mm.stop();
});

test('expired daily entries move to weekly', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  mm.add('daily', 'old');
  // make entry appear old
  (mm as any).store.daily[0].timestamp -= 20;
  (mm as any).cleanup('daily');
  expect(mm.get('daily')).toEqual([]);
  expect(mm.get('weekly')).toEqual(['old']);
  mm.stop();
});

test('expired weekly entries move to longterm', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  mm.add('weekly', 'wold');
  (mm as any).store.weekly[0].timestamp -= 40;
  (mm as any).cleanup('weekly');
  expect(mm.get('weekly')).toEqual([]);
  expect(mm.get('longterm')).toEqual(['wold']);
  mm.stop();
});
