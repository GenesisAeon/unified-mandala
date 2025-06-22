import { DebounceManager } from './DebounceManager';

test('enforces wait time between fires', () => {
  jest.useFakeTimers();
  const dm = new DebounceManager(1000);
  expect(dm.canFire()).toBe(true);
  expect(dm.canFire()).toBe(false);
  jest.advanceTimersByTime(1000);
  expect(dm.canFire()).toBe(true);
  jest.useRealTimers();
});
