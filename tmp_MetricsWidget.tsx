import React, { useEffect, useMemo, useRef, useState } from 'react';

type Buckets = Record<
  '0-50' | '50-100' | '100-250' | '250-500' | '500-1000' | '1000-2000' | '2000-5000' | '5000+',
  number
>;

type Metrics = {
  started_at: string;
  counters: { total: number; '2xx': number; '4xx': number; '5xx': number };
  latency_ms: { count: number; sum: number; avg?: number; buckets: Buckets };
};

function p95FromBuckets(b: Buckets, count: number): number {
  const order: Array<[keyof Buckets, number]> = [
    ['0-50', 50],
    ['50-100', 100],
    ['100-250', 250],
    ['250-500', 500],
    ['500-1000', 1000],
    ['1000-2000', 2000],
    ['2000-5000', 5000],
    ['5000+', Infinity],
  ];
  let cum = 0;
  const target = Math.max(0, Math.ceil(count * 0.95));
  for (const [k, ub] of order) {
    cum += b[k] ?? 0;
    if (cum >= target) return ub === Infinity ? 5000 : ub;
  }
  return 0;
}

function Sparkline({
  data,
  maxPoints = 30,
  height = 28,
}: {
  data: number[];
  maxPoints?: number;
  height?: number;
}) {
  const d = (data ?? []).slice(-maxPoints);
  const h = height;
  const max = Math.max(1, ...d, 1);
  const pts = d.map((v, i) => {
    const x = (i / Math.max(1, d.length - 1)) * 100;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  });
  const path = pts.length
    ? `M ${pts[0]} ${pts
        .slice(1)
        .map((p) => `L ${p}`)
        .join(' ')}`
    : '';
  const last = d[d.length - 1] ?? 0;
  return (
    <div className="mt-2">
      <svg viewBox={`0 0 100 ${h}`} className="w-full" style={{ height: `${h}px` }}>
        <path
          d={path}
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeWidth={1.5}
          className="stroke-slate-500"
        />
      </svg>
      <div className="mt-1 text-[11px] text-slate-500">RPM trend · latest {last}</div>
    </div>
  );
}

export default function MetricsWidget() {
  const [m, setM] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const prev = useRef<{ t: number; total: number } | null>(null);
  const [rpm, setRpm] = useState<number>(0);
  const [rpmHistory, setRpmHistory] = useState<number[]>([]);

  const fetchMetrics = async () => {
    try {
      setErr(null);
      const r = await fetch('/metrics', { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as Metrics;
      setM(j);
      const now = Date.now();
      if (prev.current) {
        const dCount = Math.max(0, j.counters.total - prev.current.total);
        const dt = Math.max(1, now - prev.current.t);
        const nextRpm = Math.round((dCount * 60000) / dt);
        setRpm(nextRpm);
        setRpmHistory((old) => [...(old ?? []).slice(-29), nextRpm]);
      } else {
        setRpmHistory((old) => [...(old ?? []).slice(-29), 0]);
      }
      prev.current = { t: now, total: j.counters.total };
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  };

  const resetMetrics = async () => {
    try {
      const r = await fetch('/metrics?reset=1', { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setRpm(0);
      setRpmHistory([]);
      prev.current = null;
      await fetchMetrics();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  };

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 5000);
    return () => clearInterval(id);
  }, []);

  const p95 = useMemo(
    () => (m ? p95FromBuckets(m.latency_ms.buckets, m.latency_ms.count) : 0),
    [m],
  );

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-3 md:p-4 text-sm w-full md:w-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">Proxy Metrics</div>
        <div className="flex gap-2">
          <button
            title="Reset counters"
            onClick={resetMetrics}
            className="rounded-xl border px-2 py-1 hover:bg-slate-50"
            type="button"
          >
            Reset
          </button>
          <button
            title="Refresh"
            onClick={fetchMetrics}
            className="rounded-xl border px-2 py-1 hover:bg-slate-50"
            type="button"
          >
            ↻
          </button>
        </div>
      </div>

      {err && <div className="mt-2 text-red-600">metrics error: {err}</div>}

      {!err && m && (
        <>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-xs text-slate-600">RPM</div>
              <div className="text-lg font-semibold">{rpm}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-xs text-slate-600">p95 (ms)</div>
              <div className="text-lg font-semibold">{p95}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-xs text-slate-600">5xx</div>
              <div className="text-lg font-semibold">{m.counters['5xx']}</div>
            </div>
          </div>
          <Sparkline data={rpmHistory} />
          <div className="mt-2 text-xs text-slate-500">
            Source: <code>/metrics</code> · auto-refresh 5s
          </div>
        </>
      )}

      {!err && !m && <div className="mt-2 text-slate-500">loading</div>}
    </div>
  );
}
