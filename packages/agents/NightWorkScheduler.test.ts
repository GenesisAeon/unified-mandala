import { vi, test, expect } from 'vitest';
import { NightWorkScheduler } from './NightWorkScheduler';

const day = () => new Date('2020-01-01T12:00:00Z');
const night = () => new Date('2020-01-01T02:00:00Z');

test('queues tasks during the day and dispatches at night', async () => {
  const dispatch = vi.fn();
  const scheduler = new NightWorkScheduler(dispatch, 0, 6, day);
  await scheduler.handle({ id: 't1' } as any);
  expect(dispatch).not.toHaveBeenCalled();
  expect(scheduler.getQueueLength()).toBe(1);
  (scheduler as any).now = night;
  scheduler.processQueue();
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ id: 't1' }));
  expect(scheduler.getQueueLength()).toBe(0);
});
