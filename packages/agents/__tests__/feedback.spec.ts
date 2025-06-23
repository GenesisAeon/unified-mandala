import { describe, it, expect } from 'vitest';
import { FeedbackAgent } from '../feedback';

describe('FeedbackAgent', () => {
  it('triggers hook on file creation', () => {
    let called = '';
    const agent = new FeedbackAgent(p => (called = p));
    agent.onFileCreated('x.txt');
    expect(called).toBe('x.txt');
  });
});
