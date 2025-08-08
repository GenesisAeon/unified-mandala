import { describe, it, expect, vi } from 'vitest';
import { ReviewAgent } from '../ReviewAgent';

describe('ReviewAgent', () => {
  it('logs first conversation fragment for review', () => {
    const agent = new ReviewAgent();
    const conversation = {
      mapping: {
        root: { id: 'root', message: null, parent: null, children: ['a'] },
        a: {
          id: 'a',
          message: { content: 'Hello world' },
          parent: 'root',
          children: []
        }
      }
    };
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    agent.handle({ id: 't1', description: 'review', conversation } as any);
    expect(spy).toHaveBeenCalledWith(
      '📝 ReviewAgent → review fragment: Hello world'
    );
    spy.mockRestore();
  });
});
