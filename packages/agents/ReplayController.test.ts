import { ReplayController } from './ReplayController';
import { AeonMemory } from '../core/AeonMemory';

test('logs replay message', () => {
  jest.useFakeTimers();
  console.log = jest.fn();
  AeonMemory.record('x', { task: { id: 't1', description: 'd' } });
  const c = new ReplayController(1000);
  c.start();
  jest.advanceTimersByTime(1000);
  expect((console.log as jest.Mock).mock.calls[0][0]).toContain('t1');
  jest.useRealTimers();
});
