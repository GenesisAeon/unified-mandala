import fs from 'fs';
import path from 'path';
import { test, expect, vi } from 'vitest';
import { OvernightWorkerAgent } from '../OvernightWorkerAgent';

const day = new Date('2020-01-01T12:00:00Z');
const night = new Date('2020-01-01T02:00:00Z');

test('processes queued tasks at night and logs progress', async () => {
  const dispatch = vi.fn();
  const logFile = path.join(__dirname, 'overnight.log');
  let current = day;
  const now = () => current;
  const agent = new OvernightWorkerAgent(dispatch, logFile, now);

  await agent.handle({ id: 't1', summary: 'work' } as any);
  expect(dispatch).not.toHaveBeenCalled();
  expect(agent.getQueueLength()).toBe(1);

  current = night;
  await agent.process();
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ id: 't1' }));
  const log = fs.readFileSync(logFile, 'utf8').trim();
  expect(log).toContain('t1:work');
  fs.unlinkSync(logFile);
});
