import { MemoryManager } from './index';

test('stores and retrieves entries', () => {
  const mm = new MemoryManager(10);
  mm.add('daily', 'note');
  expect(mm.get('daily')).toEqual(['note']);
});
