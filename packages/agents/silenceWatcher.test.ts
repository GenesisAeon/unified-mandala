import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { SilenceWatcher } from './silenceWatcher';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('detects silence after threshold', () => {
  const sw = new SilenceWatcher(1000);
  expect(sw.shouldAnalyze()).toBe(false);
  vi.advanceTimersByTime(1500);
  expect(sw.shouldAnalyze()).toBe(true);
  sw.stop();
});

test('resets timer on event', () => {
  const sw = new SilenceWatcher(1000);
  vi.advanceTimersByTime(900);
  GPTEventHub.emit('test');
  vi.advanceTimersByTime(900);
  expect(sw.shouldAnalyze()).toBe(false);
  vi.advanceTimersByTime(200);
  expect(sw.shouldAnalyze()).toBe(true);
  sw.stop();
});
