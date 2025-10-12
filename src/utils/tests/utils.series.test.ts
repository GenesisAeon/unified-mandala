import { describe, it, expect } from 'vitest';
import { resampleHourly, movingAverage } from '../series';
import type { Series } from '../../adapters/types';

function mkSeries(ts: string[], vs: number[]): Series {
  return { id: 's', points: ts.map((t, i) => ({ t, v: vs[i] })) } as any;
}

describe('utils: series resample/movingAverage', () => {
  it('resampleHourly averages within same hour and sorts by time', () => {
    const s = mkSeries(
      ['2025-01-01T10:00:10.000Z', '2025-01-01T10:15:00.000Z', '2025-01-01T11:00:00.000Z'],
      [1, 3, 5],
    );
    const r = resampleHourly(s);
    expect(r.points.length).toBe(2);
    expect(r.points[0].t).toBe('2025-01-01T10:00:00.000Z');
    expect(r.points[0].v).toBeCloseTo(2, 6);
    expect(r.points[1].t).toBe('2025-01-01T11:00:00.000Z');
    expect(r.points[1].v).toBe(5);
  });

  it('movingAverage computes mean over sliding window', () => {
    const s = mkSeries(
      ['2025-01-01T10:00:00.000Z', '2025-01-01T10:01:00.000Z', '2025-01-01T10:02:00.000Z'],
      [1, 3, 5],
    );
    const r = movingAverage(s, 2);
    expect(r.points.map((p) => p.v)).toEqual([1, 2, 4]);
  });
});
