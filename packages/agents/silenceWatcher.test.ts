import { SilenceWatcher } from './silenceWatcher';

test('returns false by default', () => {
  const sw = new SilenceWatcher();
  expect(sw.shouldAnalyze()).toBe(false);
});
