import { describe, it, expect } from 'vitest';
import { qualityControl, toMRV, type TimeSeries } from '../../src/utils/timeseries';

describe('utils/timeseries index re-exports', () => {
  it('re-exports qualityControl and toMRV working together', () => {
    const series: TimeSeries = [
      { timestamp: new Date('2020-01-01T00:00:00Z'), value: 1 },
      { timestamp: new Date('2020-01-01T01:00:00Z'), value: null },
    ];
    const qc = qualityControl(series);
    expect(qc.total).toBe(2);
    expect(qc.missing).toBe(1);
    const mrv = toMRV(series);
    expect(mrv.count).toBe(2);
    expect(mrv.mean).toBeCloseTo(1, 6);
    expect(mrv.missing).toBe(1);
  });
});
