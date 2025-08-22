import { saveSigil, createTasks } from './src/index';

test('saveSigil returns provided id', () => {
  expect(saveSigil('alpha')).toBe('alpha');
});

test('createTasks returns a task array referencing the sigil', () => {
  const tasks = createTasks('alpha');
  expect(tasks[0]).toContain('alpha');
});
