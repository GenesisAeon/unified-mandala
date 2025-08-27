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
