import { describe, it, expect, vi } from 'vitest';
import { AgentDispatcher } from './AgentDispatcher';
import { Agent, Task } from '../core/interfaces';

describe('AgentDispatcher', () => {
  it('dispatches by priority and catches errors', async () => {
    const calls: string[] = [];
    const agents: Agent[] = [
      {
        id: 'a',
        layer: 'L',
        priority: 1,
        handle: vi.fn().mockImplementation(() => calls.push('a')),
      } as any,
      {
        id: 'b',
        layer: 'L',
        priority: 5,
        handle: vi.fn().mockImplementation(() => {
          calls.push('b');
          throw new Error('x');
        }),
      } as any,
    ];
    const d = new AgentDispatcher(agents);
    await d.dispatch({ id: '1', description: 't' });
    expect(calls).toEqual(['b', 'a']);
    expect((agents[1].handle as any).mock.calls.length).toBe(1);
  });
});
