import { describe, it, expect } from 'vitest';
import AutoTuningAgent from './AutoTuningAgent';

describe('AutoTuningAgent', () => {
  it('searches parameter space within budget and logs results', async () => {
    const logs: Array<{ params: number; score: number }> = [];
    const agent = new AutoTuningAgent<number>(2, (r) => logs.push(r));
    const candidates = [1, 2, 3];
    const best = await agent.tune(candidates, async (p) => p);

    expect(best).toEqual({ params: 2, score: 2 });
    expect(logs.length).toBe(2);
  });
});
