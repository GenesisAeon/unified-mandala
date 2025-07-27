import { describe, it, expect } from 'vitest';
import { TuringOrchestrator } from './TuringOrchestrator';

describe('TuringOrchestrator', () => {
  it('different response fails Turing test', () => {
    const t = new TuringOrchestrator();
    expect(t.run('hi', 'hello')).toBe(true);
  });

  it('calculates batch pass rate', () => {
    const t = new TuringOrchestrator();
    const rate = t.runBatch([
      { prompt: 'a', response: 'b' },
      { prompt: 'a', response: 'a' }
    ]);
    expect(rate).toBeCloseTo(0.5);
  });
});
