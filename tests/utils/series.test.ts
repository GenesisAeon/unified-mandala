import { describe, it, expect } from 'vitest';
import type { Series } from '../../src/adapters/types';
import { resampleHourly, movingAverage } from '../../src/utils/series';

const mkSeries = (points: Array<[string, number]>): Series => ({
  id: 's',
  points: points.map(([t, v]) => ({ t, v })),
});

describe('utils/series', () => {
  it('resampleHourly groups and averages by hour', () => {
    const s = mkSeries([
      ['2024-01-01T10:10:00.000Z', 2],
      ['2024-01-01T10:59:59.000Z', 4],
      ['2024-01-01T11:05:00.000Z', 6],
    ]);
    const r = resampleHourly(s);
    expect(r.points).toEqual([
      { t: '2024-01-01T10:00:00.000Z', v: 3 },
      { t: '2024-01-01T11:00:00.000Z', v: 6 },
    ]);
  });

  it('movingAverage computes windowed mean', () => {
    const s = mkSeries([
      ['t1', 1],
      ['t2', 3],
      ['t3', 5],
    ]);
    const r = movingAverage(s, 2);
    // [1], [1,3], [3,5] -> 1, 2, 4
    expect(r.points.map((p) => p.v)).toEqual([1, 2, 4]);
  });
});
