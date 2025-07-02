import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReplayController } from './ReplayController';
import { AeonMemory } from '../core/AeonMemory';

test('logs replay message', () => {
  vi.useFakeTimers();
  console.log = vi.fn();
  AeonMemory.record('x', { task: { id: 't1', description: 'd' } });
  const c = new ReplayController(1000);
  c.start();
  vi.advanceTimersByTime(1000);
  expect((console.log as vi.Mock).mock.calls[0][0]).toContain('t1');
  vi.useRealTimers();
});
