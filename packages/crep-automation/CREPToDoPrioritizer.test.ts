import { prioritizeTodos } from './CREPToDoPrioritizer';

test('prioritizes high when E positive', () => {
  const result = prioritizeTodos([{ text: 'x' }], { E: 1 });
  expect(result[0].priority).toBe('high');
});

test('prioritizes low when E negative', () => {
  const result = prioritizeTodos([{ text: 'x' }], { E: -1 });
  expect(result[0].priority).toBe('low');
});
