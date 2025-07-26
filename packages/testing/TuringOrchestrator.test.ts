import { describe, it, expect } from 'vitest';
import { TuringOrchestrator } from './TuringOrchestrator';

describe('TuringOrchestrator', () => {
  it('different response fails Turing test', () => {
    const t = new TuringOrchestrator();
    expect(t.run('hi', 'hello')).toBe(true);
  });
});
