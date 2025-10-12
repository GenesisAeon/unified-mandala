import { describe, it, expect } from 'vitest';
import { toMRV } from '../../src/utils/timeseries/mrv';
import type { TimeSeries } from '../../src/utils/timeseries/types';

describe('utils/timeseries toMRV', () => {
  it('computes count, mean of non-missing values, and missing count', () => {
    const series: TimeSeries = [
      { timestamp: new Date('2020-01-01T00:00:00Z'), value: 1 },
      { timestamp: new Date('2020-01-01T01:00:00Z'), value: 3 },
      { timestamp: new Date('2020-01-01T02:00:00Z'), value: null },
      { timestamp: new Date('invalid'), value: NaN as any },
    ];
    const mrv = toMRV(series);
    expect(mrv.count).toBe(4);
    expect(mrv.mean).toBeCloseTo(2, 6); // (1+3)/2
    expect(mrv.missing).toBe(2); // null and NaN
  });
});
