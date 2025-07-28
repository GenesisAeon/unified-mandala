import { describe, it, expect } from 'vitest';
import { runTuringSuite } from './TuringTestSuite';

describe('runTuringSuite', () => {
  it('passes when responses hide identity', async () => {
    const result = await runTuringSuite(async () => 'Hello there');
    expect(result).toBe(true);
  });

  it('fails when bot identity revealed', async () => {
    const result = await runTuringSuite(async () => 'I am a bot');
    expect(result).toBe(false);
  });
});
