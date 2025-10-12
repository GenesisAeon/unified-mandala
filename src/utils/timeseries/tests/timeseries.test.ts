import { describe, it, expect } from 'vitest';
import { qualityControl } from '../quality';
import { toMRV } from '../mrv';
import * as TS from '../index';

describe('utils/timeseries', () => {
  it('qualityControl counts missing and invalid points', () => {
    const series = [
      { timestamp: new Date('2025-01-01T00:00:00Z'), value: 1 },
      { timestamp: new Date('invalid'), value: 2 }, // invalid timestamp
      { timestamp: new Date('2025-01-01T00:10:00Z'), value: null }, // missing
      { timestamp: new Date('2025-01-01T00:20:00Z'), value: NaN }, // missing
    ] as any;
    const qc = qualityControl(series);
    expect(qc.total).toBe(4);
    expect(qc.invalid).toBe(1);
    expect(qc.missing).toBe(2);
  });

  it('toMRV summarizes count, mean (excluding missing), and missing', () => {
    const series = [
      { timestamp: new Date('2025-01-01T00:00:00Z'), value: 1 },
      { timestamp: new Date('2025-01-01T00:10:00Z'), value: null },
      { timestamp: new Date('2025-01-01T00:20:00Z'), value: 3 },
    ] as any;
    const mrv = toMRV(series);
    expect(mrv.count).toBe(3);
    expect(mrv.missing).toBe(1);
    expect(mrv.mean).toBeCloseTo((1 + 3) / 2, 6);
  });

  it('barrel index re-exports symbols', () => {
    expect(typeof TS.qualityControl).toBe('function');
    expect(typeof TS.toMRV).toBe('function');
  });
});
