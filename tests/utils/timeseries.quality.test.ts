import { describe, it, expect } from 'vitest';
import { qualityControl } from '../../src/utils/timeseries/quality';
import type { TimeSeries } from '../../src/utils/timeseries/types';

describe('utils/timeseries qualityControl', () => {
  it('counts missing and invalid entries', () => {
    const series: TimeSeries = [
      { timestamp: new Date('2020-01-01T00:00:00Z'), value: 1 }, // ok
      { timestamp: new Date('invalid'), value: 2 }, // invalid ts
      { timestamp: new Date('2020-01-01T01:00:00Z'), value: null }, // missing
      { timestamp: new Date('2020-01-01T02:00:00Z'), value: NaN as any }, // missing
      { timestamp: new Date('invalid'), value: null }, // invalid + missing
    ];
    const qc = qualityControl(series);
    expect(qc.total).toBe(5);
    expect(qc.missing).toBe(3); // null, NaN, null
    expect(qc.invalid).toBe(2); // invalid dates
  });
});
