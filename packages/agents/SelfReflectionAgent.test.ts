import { describe, it, expect } from 'vitest';
import { SelfReflectionAgent } from './SelfReflectionAgent';

describe('SelfReflectionAgent', () => {
  it('records and summarizes messages', () => {
    const agent = new SelfReflectionAgent();
    agent.record('a');
    agent.record('b');
    expect(agent.summarize()).toBe('a\nb');
  });
});
