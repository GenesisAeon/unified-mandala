import type { Series } from "../adapters/types";
export function resampleHourly(s: Series): Series {
  const byHour = new Map<string, number[]>();
  for (const p of s.points) {
    const h = p.t.slice(0, 13) + ":00:00.000Z";
    const arr = byHour.get(h) ?? [];
    arr.push(p.v);
    byHour.set(h, arr);
  }
  const points = [...byHour.entries()].map(([t, arr]) => ({
    t, v: arr.reduce((a, b) => a + b, 0) / arr.length
  })).sort((a, b) => a.t.localeCompare(b.t));
  return { ...s, points };
}

export function movingAverage(s: Series, window: number): Series {
  if (window <= 1) return { ...s };
  const points = s.points.map((p, idx) => {
    const start = Math.max(0, idx - window + 1);
    const subset = s.points.slice(start, idx + 1);
    const v = subset.reduce((sum, q) => sum + q.v, 0) / subset.length;
    return { t: p.t, v };
  });
  return { ...s, points };
}
