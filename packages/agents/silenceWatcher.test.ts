import { SilenceWatcher } from './silenceWatcher';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('detects silence after threshold', () => {
  const sw = new SilenceWatcher(1000);
  expect(sw.shouldAnalyze()).toBe(false);
  jest.advanceTimersByTime(1500);
  expect(sw.shouldAnalyze()).toBe(true);
  sw.stop();
});

test('resets timer on event', () => {
  const sw = new SilenceWatcher(1000);
  jest.advanceTimersByTime(900);
  GPTEventHub.emit('test');
  jest.advanceTimersByTime(900);
  expect(sw.shouldAnalyze()).toBe(false);
  jest.advanceTimersByTime(200);
  expect(sw.shouldAnalyze()).toBe(true);
  sw.stop();
});
