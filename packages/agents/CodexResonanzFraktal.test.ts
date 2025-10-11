import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { CodexResonanzFraktal } from './CodexResonanzFraktal';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('CodexResonanzFraktal', () => {
  beforeEach(() => {
    vi.spyOn(GPTEventHub, 'emit');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('fractalizes input and emits event', () => {
    const fraktal = new CodexResonanzFraktal();
    const result = fraktal.fractalize('alpha');
    expect(result).toBe('fractal:alpha');
    expect(fraktal.history()).toEqual(['fractal:alpha']);
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0]).toEqual([
      'codex:fraktal',
      'fractal:alpha',
    ]);
  });
});
