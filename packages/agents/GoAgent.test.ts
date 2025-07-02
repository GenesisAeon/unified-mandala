import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { GoAgent } from './GoAgent';

describe('GoAgent', () => {
  it('loads tasks and filters pending ones', () => {
    const agent = new GoAgent('.');
    expect(Array.isArray(agent.jsonTasks)).toBe(true);
    expect(agent.pending()).toEqual(agent.jsonTasks.filter(t => t.status !== 'done'));
  });
});
