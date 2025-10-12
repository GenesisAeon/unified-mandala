import { describe, it, expect } from 'vitest';
import * as utils from '../../src/utils';

describe('utils index exports', () => {
  it('re-exports calculateMetrics and interAdapterResonance', () => {
    expect(typeof (utils as any).calculateMetrics).toBe('function');
    expect(typeof (utils as any).interAdapterResonance).toBe('function');
  });
});
