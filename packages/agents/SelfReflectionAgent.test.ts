import { describe, it, expect } from 'vitest';
import { SelfReflectionAgent } from './SelfReflectionAgent';
import { MemoryGovernance } from '../core/MemoryGovernance';

describe('SelfReflectionAgent', () => {
  it('records and summarizes messages', () => {
    const agent = new SelfReflectionAgent();
    agent.record('a');
    agent.record('b');
    expect(agent.summarize()).toBe('a\nb');
  });

  it('flags memories matching pattern', () => {
    const gov = new MemoryGovernance();
    gov.set('m1', 'hello world');
    gov.set('m2', 'bad data');
    const agent = new SelfReflectionAgent(gov);
    const flagged = agent.reflectMemory(/bad/);
    expect(flagged).toEqual(['m2']);
  });
});
