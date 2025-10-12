import { describe, it, expect } from 'vitest';
import * as U from '../index';

describe('utils index barrel', () => {
  it('re-exports expected symbols', () => {
    expect(typeof U.interAdapterResonance).toBe('function');
    expect(typeof U.calculateMetrics).toBe('function');
  });
});
