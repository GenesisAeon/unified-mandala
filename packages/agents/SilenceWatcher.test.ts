import { SilenceWatcher } from './SilenceWatcher';

test('detects inactivity', () => {
  let now = 0;
  const watcher = new SilenceWatcher(1000, () => now);
  expect(watcher.shouldAnalyze()).toBe(false);
  now = 1500;
  expect(watcher.shouldAnalyze()).toBe(true);
});
