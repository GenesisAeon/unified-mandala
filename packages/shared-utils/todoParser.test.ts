import { extractTodos } from './todoParser';

test('extracts todo items', () => {
  const text = '* [ ] open task\n* [x] done task';
  const items = extractTodos(text);
  expect(items).toEqual([
    { text: 'open task', done: false },
    { text: 'done task', done: true }
  ]);
});
