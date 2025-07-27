import { describe, it, expect } from 'vitest';
import { runTuringTest } from './TuringTestSuite';

describe('runTuringTest', () => {
  it('returns true when response hides identity', async () => {
    const res = await runTuringTest(async () => 'I am doing well.');
    expect(res).toBe(true);
  });

  it('returns false when response reveals bot', async () => {
    const res = await runTuringTest(async () => 'I am a bot');
    expect(res).toBe(false);
  });
});
