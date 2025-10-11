import { describe, it, expect } from 'vitest';
import { QuantumTheoryAgent } from './QuantumTheoryAgent';

describe('QuantumTheoryAgent', () => {
  it('emits anomaly when CPT delta exceeds threshold', () => {
    const agent = new QuantumTheoryAgent(0.5);
    const events: any[] = [];
    agent.onAnomaly((m) => events.push(m));
    agent.observe({ cptDelta: 0.8 });
    expect(events).toHaveLength(1);
    expect(events[0].cptDelta).toBe(0.8);
  });

  it('does not emit anomaly for safe measurements', () => {
    const agent = new QuantumTheoryAgent(1);
    const events: any[] = [];
    agent.onAnomaly((m) => events.push(m));
    agent.observe({ cptDelta: 0.4 });
    expect(events).toHaveLength(0);
  });
});
