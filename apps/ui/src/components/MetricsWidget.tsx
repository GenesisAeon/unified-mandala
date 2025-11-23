import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getGrafanaBaseUrl, openGrafanaExplore, isGrafanaUrlValid } from '../lib/grafana';
import { openRUMSettings, onGrafanaValidity } from '../lib/uiBus';

type Buckets = Record<
  '0-50' | '50-100' | '100-250' | '250-500' | '500-1000' | '1000-2000' | '2000-5000' | '5000+',
  number
>;

type Metrics = {
  started_at: string;
  counters: { total: number; '2xx': number; '4xx': number; '5xx': number };
  latency_ms: { count: number; sum: number; avg?: number; buckets: Buckets };
};

function quantileFromBuckets(b: Buckets, count: number, q: number): number {
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
  const target = Math.max(0, Math.ceil(count * q));
  for (const [k, ub] of order) {
    cum += b[k] ?? 0;
    if (cum >= target) return ub === Infinity ? 5000 : ub;
  }
  return 0;
}

function relSince(iso: string | undefined): string {
  if (!iso) return '';
  const t0 = Date.parse(iso);
  if (!Number.isFinite(t0)) return '';
  const secs = Math.max(0, Math.floor((Date.now() - t0) / 1000));
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
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
  const [showP99, setShowP99] = useState<boolean>(false);
  const [autoSnap, setAutoSnap] = useState<boolean>(false);
  const [snapEveryMin, setSnapEveryMin] = useState<number>(5);
  const snapTimer = useRef<number | null>(null);
  const lastAnomalyAt = useRef<number>(0);
  const [autoRag, setAutoRag] = useState<boolean>(false);
  const [ragToast, setRagToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [ragBadge, setRagBadge] = useState<{ ts: string; count?: number } | null>(null);
  const [traceToast, setTraceToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [gToast, setGToast] = useState<string | null>(null);
  const gToastTimer = useRef<number | null>(null);
  const [gPulse, setGPulse] = useState(false);
  const gPulseTimer = useRef<number | null>(null);

  const exportMetricsJson = async () => {
    try {
      const res = await fetch('/metrics', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proxy-metrics-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('metrics export failed:', e);
    }
  };

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
      await maybeRememberAnomaly(j);
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

  const saveMetricsToDataDir = async () => {
    try {
      const res = await fetch('/metrics', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const uri = `data://logs/metrics/proxy-metrics-${ts}.json`;
      const r = await fetch('/api/tools/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri, encoding: 'utf8', content: JSON.stringify(data, null, 2) }),
      });
      if (!r.ok) throw new Error('fs.write failed');
      // build summary entry
      const total = data?.counters?.total ?? 0;
      const ok2xx = data?.counters?.['2xx'] ?? 0;
      const err4xx = data?.counters?.['4xx'] ?? 0;
      const err5xx = data?.counters?.['5xx'] ?? 0;
      const avg_ms =
        Math.round(
          ((data?.latency_ms?.avg ??
            (data?.latency_ms?.sum ?? 0) / Math.max(1, data?.latency_ms?.count ?? 1)) +
            Number.EPSILON) *
            100,
        ) / 100;
      const p95_ms = quantileFromBuckets(
        data?.latency_ms?.buckets ?? {},
        data?.latency_ms?.count ?? 0,
        0.95,
      );
      const p99_ms = quantileFromBuckets(
        data?.latency_ms?.buckets ?? {},
        data?.latency_ms?.count ?? 0,
        0.99,
      );
      await updateMetricsIndexYaml({
        ts: new Date().toISOString(),
        file: uri,
        total,
        ok2xx,
        err4xx,
        err5xx,
        avg_ms,
        p95_ms,
        p99_ms,
      });
      await maybeAutoRagIndex();
    } catch (e) {
      console.error('metrics save failed:', e);
    }
  };

  const MAX_INDEX_ENTRIES = 200;
  const updateMetricsIndexYaml = async (newEntry: {
    ts: string;
    file: string;
    total?: number;
    ok2xx?: number;
    err4xx?: number;
    err5xx?: number;
    avg_ms?: number;
    p95_ms?: number;
    p99_ms?: number;
  }) => {
    try {
      const idxUri = 'data://logs/metrics/index.yaml';
      let current = '';
      try {
        const rr = await fetch('/api/tools/fs/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uri: idxUri, encoding: 'utf8' }),
        });
        if (rr.ok) {
          const jj = await rr.json();
          current = jj?.content ?? '';
        }
      } catch {}
      // attempt to parse existing YAML lines into entries array (naive)
      let entries: any[] = [];
      if (current && current.trim()) {
        const lines = current.split(/\r?\n/);
        let block: any | null = null;
        for (const ln of lines) {
          if (/^\s*-\s*/.test(ln)) {
            if (block) entries.push(block);
            block = {};
            continue;
          }
          const m = ln.match(/^\s*([A-Za-z0-9_+]+):\s*(.*)\s*$/);
          if (m && block) {
            const k = m[1];
            const v = m[2].replace(/^"|"$/g, '');
            block[k] = v;
          }
        }
        if (block) entries.push(block);
      }
      entries.push(newEntry);
      const trimmed = entries.slice(-MAX_INDEX_ENTRIES);
      const started =
        (current.match(/^started_at:\s*(.*)$/m) || [null, ''])![1] || new Date().toISOString();
      const keep = MAX_INDEX_ENTRIES;
      const header = `started_at: ${started}\nkeep: ${keep}\nentries:\n`;
      const body = trimmed
        .map((e) =>
          [
            `  - ts: "${e.ts}"`,
            `    file: "${e.file}"`,
            `    total: ${e.total ?? 0}`,
            `    2xx: ${e.ok2xx ?? 0}`,
            `    4xx: ${e.err4xx ?? 0}`,
            `    5xx: ${e.err5xx ?? 0}`,
            `    avg_ms: ${Math.round(e.avg_ms ?? 0)}`,
            `    p95_ms: ${Math.round(e.p95_ms ?? 0)}`,
            `    p99_ms: ${Math.round(e.p99_ms ?? 0)}`,
          ].join('\n'),
        )
        .join('\n');
      const yaml = header + body + '\n';
      await fetch('/api/tools/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: idxUri, encoding: 'utf8', content: yaml }),
      });
    } catch (e) {
      console.error('metrics index update failed:', e);
    }
  };

  function metricsToCsvPayload(mj: any): string {
    const total = mj?.counters?.total ?? 0;
    const ok2xx = mj?.counters?.['2xx'] ?? 0;
    const err4xx = mj?.counters?.['4xx'] ?? 0;
    const err5xx = mj?.counters?.['5xx'] ?? 0;
    const avg =
      Math.round(
        ((mj?.latency_ms?.avg ??
          (mj?.latency_ms?.sum ?? 0) / Math.max(1, mj?.latency_ms?.count ?? 1)) +
          Number.EPSILON) *
          100,
      ) / 100;
    const p95csv = quantileFromBuckets(
      mj?.latency_ms?.buckets ?? {},
      mj?.latency_ms?.count ?? 0,
      0.95,
    );
    const p99csv = quantileFromBuckets(
      mj?.latency_ms?.buckets ?? {},
      mj?.latency_ms?.count ?? 0,
      0.99,
    );
    const rows: string[] = [];
    rows.push('started_at,total,2xx,4xx,5xx,avg_ms,p95_ms,p99_ms');
    rows.push([mj?.started_at ?? '', total, ok2xx, err4xx, err5xx, avg, p95csv, p99csv].join(','));
    return rows.join('\n');
  }

  const exportMetricsCsv = async () => {
    try {
      const res = await fetch('/metrics', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const csv = metricsToCsvPayload(data);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proxy-metrics-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('metrics csv export failed:', e);
    }
  };

  const openInGrafana = () => {
    openGrafanaExplore('service.name = "mandala-ui" and span.name = "ui.metrics.test"');
  };

  const createTestSpan = async () => {
    try {
      const st = (window as any).__rum?.status?.();
      if (!st?.enabled) {
        setTraceToast({ ok: false, msg: 'RUM disabled — enable in Settings.' });
        setTimeout(() => setTraceToast(null), 2500);
        return;
      }
      const api = await import('@opentelemetry/api');
      const tracer = api.trace.getTracer('um-ui', '0.1.0');
      const span = tracer.startSpan('ui.metrics.test', {
        attributes: {
          'app.component': 'MetricsWidget',
          'rum.test': true,
        } as any,
      });
      span.addEvent('test.start', { at: Date.now() } as any);
      await new Promise((r) => setTimeout(r, 30));
      const child = tracer.startSpan('ui.metrics.child');
      child.addEvent('child.work');
      await new Promise((r) => setTimeout(r, 10));
      child.end();
      span.addEvent('test.end', { at: Date.now() } as any);
      span.end();
      setTraceToast({ ok: true, msg: 'Sent test span (ui.metrics.test)' });
    } catch (e: any) {
      setTraceToast({ ok: false, msg: `Trace failed: ${e?.message ?? String(e)}` });
    } finally {
      setTimeout(() => setTraceToast(null), 3000);
    }
  };

  const maybeAutoRagIndex = async () => {
    if (!autoRag) return;
    try {
      const r = await fetch('/api/tools/rag/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roots: ['data://logs/metrics'],
          exts: ['.json', '.yaml'],
          max_depth: 3,
          limit: 200,
          chunk_chars: 600,
          chunk_overlap: 120,
          fresh: false,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.error) throw new Error(j?.detail || j?.error || `HTTP ${r.status}`);
      setRagBadge({ ts: new Date().toISOString(), count: j?.chunks ?? undefined });
      setRagToast({ ok: true, msg: `RAG index appended (${j?.chunks ?? '?'} chunks)` });
    } catch (e: any) {
      setRagToast({ ok: false, msg: `RAG index failed: ${e?.message ?? String(e)}` });
    } finally {
      setTimeout(() => setRagToast(null), 3500);
    }
  };

  const maybeRememberAnomaly = async (mj: any) => {
    try {
      const p95ms = quantileFromBuckets(
        mj?.latency_ms?.buckets ?? {},
        mj?.latency_ms?.count ?? 0,
        0.95,
      );
      const err5 = mj?.counters?.['5xx'] ?? 0;
      const hit = p95ms > 10_000 || err5 > 0;
      const now = Date.now();
      if (hit && now - lastAnomalyAt.current > 5 * 60_000) {
        lastAnomalyAt.current = now;
        const text = `Metrics anomaly: p95=${Math.round(p95ms)}ms, 5xx=${err5}`;
        await fetch('/api/tools/memory/remember', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, tags: ['metrics', 'anomaly', 'playground'] }),
        }).catch(() => {});
      }
    } catch {}
  };

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const off = onGrafanaValidity((v) => {
      setGToast(v ? 'Explore aktiviert' : 'Explore deaktiviert');
      if (gToastTimer.current) window.clearTimeout(gToastTimer.current);
      gToastTimer.current = window.setTimeout(() => setGToast(null), 2200) as unknown as number;
      if (v) {
        setGPulse(true);
        if (gPulseTimer.current) window.clearTimeout(gPulseTimer.current);
        gPulseTimer.current = window.setTimeout(() => setGPulse(false), 1200) as unknown as number;
      }
    });
    return () => {
      off?.();
      if (gToastTimer.current) window.clearTimeout(gToastTimer.current);
      if (gPulseTimer.current) window.clearTimeout(gPulseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!autoSnap) {
      if (snapTimer.current) window.clearInterval(snapTimer.current);
      snapTimer.current = null;
      return;
    }
    saveMetricsToDataDir().catch(() => {});
    snapTimer.current = window.setInterval(
      () => {
        saveMetricsToDataDir().catch(() => {});
      },
      Math.max(1, snapEveryMin) * 60_000,
    );
    return () => {
      if (snapTimer.current) window.clearInterval(snapTimer.current);
    };
  }, [autoSnap, snapEveryMin]);

  const pVal = useMemo(() => {
    if (!m) return 0;
    return showP99
      ? quantileFromBuckets(m.latency_ms.buckets as Buckets, m.latency_ms.count, 0.99)
      : quantileFromBuckets(m.latency_ms.buckets as Buckets, m.latency_ms.count, 0.95);
  }, [m, showP99]);
  const since = useMemo(() => (m?.started_at ? relSince(m.started_at) : ''), [m?.started_at, m]);

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-3 md:p-4 text-sm w-full md:w-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">Proxy Metrics</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
            title="p95/p99: geschätzte Perzentile aus der Latenz-Histogrammverteilung seit Start/Reset."
          >
            ↻
          </button>
          <button
            type="button"
            onClick={exportMetricsCsv}
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
            title="Aktuelle /metrics als CSV herunterladen"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={saveMetricsToDataDir}
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
            title="Metrics-Snapshot unter data://logs/metrics/ speichern"
          >
            Save to data://
          </button>
          <button
            title={showP99 ? 'Switch to p95' : 'Switch to p99'}
            onClick={() => setShowP99((v) => !v)}
            className="rounded-xl border px-2 py-1 hover:bg-slate-50"
            type="button"
          >
            {showP99 ? 'p99' : 'p95'}
          </button>
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
          <button
            type="button"
            onClick={exportMetricsJson}
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
            title="Aktuelle /metrics als JSON herunterladen"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={exportMetricsCsv}
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
            title="Aktuelle /metrics als CSV herunterladen"
          >
            Export CSV
          </button>
          <label className="ml-2 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={autoSnap}
              onChange={(e) => setAutoSnap(e.target.checked)}
            />
            Auto-snapshot
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={snapEveryMin}
            onChange={(e) => setSnapEveryMin(Number(e.target.value) || 5)}
            className="w-16 rounded border px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoRag} onChange={(e) => setAutoRag(e.target.checked)} />
          Auto-index RAG (metrics)
        </label>
        {ragBadge && (
          <span
            className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5"
            title={`last: ${ragBadge.ts}`}
          >
            RAG ok{typeof ragBadge.count === 'number' ? `  +${ragBadge.count}` : ''}
          </span>
        )}
        {(() => {
          const canOpenGrafana = isGrafanaUrlValid(getGrafanaBaseUrl());
          return (
            <button
              type="button"
              onClick={openInGrafana}
              className={`rounded-xl border px-3 py-1 text-sm ${canOpenGrafana ? '' : 'opacity-50 cursor-not-allowed'} ${gPulse ? 'ring-2 ring-emerald-300' : ''}`}
              title={
                canOpenGrafana
                  ? 'Open in Grafana Explore'
                  : 'Grafana URL ungültig – stelle sie in Settings → RUM ein'
              }
              disabled={!canOpenGrafana}
            >
              Open in Grafana
            </button>
          );
        })()}
        {gToast && (
          <span
            role="status"
            aria-live="polite"
            className="ml-2 inline-block rounded-lg bg-slate-900 px-2 py-1 text-xs text-white shadow transition"
            title={gToast}
          >
            {gToast}
          </span>
        )}
        {(() => {
          const canOpenGrafana = isGrafanaUrlValid(getGrafanaBaseUrl());
          if (canOpenGrafana) return null;
          return (
            <button
              type="button"
              className="rounded-xl border px-2 py-1 text-xs"
              title="Settings → RUM öffnen"
              onClick={openRUMSettings}
            >
              open settings
            </button>
          );
        })()}
        <button
          type="button"
          onClick={createTestSpan}
          className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
          title="Send a demo OTel span to verify browser RUM"
        >
          Trace test
        </button>
      </div>

      {ragToast && (
        <div
          role="status"
          className={`mt-2 text-xs rounded-md px-2 py-1 ${ragToast.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
        >
          {ragToast.msg}
        </div>
      )}

      {traceToast && (
        <div
          role="status"
          className={`mt-2 text-xs rounded-md px-2 py-1 ${traceToast.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-800'}`}
        >
          {traceToast.msg}
        </div>
      )}

      {err && <div className="mt-2 text-red-600">metrics error: {err}</div>}

      {!err && m && (
        <>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-xs text-slate-600">RPM</div>
              <div className="text-lg font-semibold">{rpm}</div>
            </div>
            {(() => {
              const colorCls =
                pVal > 20000
                  ? 'bg-red-50 text-red-700'
                  : pVal > 10000
                    ? 'bg-yellow-50 text-yellow-800'
                    : 'bg-slate-50';
              const textStrong = pVal > 10000 ? 'text-current' : 'text-slate-900';
              return (
                <div className={`rounded-xl p-2 text-center ${colorCls}`}>
                  <div className="text-xs text-slate-600">{showP99 ? 'p99' : 'p95'} (ms)</div>
                  <div className={`text-lg font-semibold ${textStrong}`}>{pVal}</div>
                </div>
              );
            })()}
            <div className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-xs text-slate-600">5xx</div>
              <div className="text-lg font-semibold">{m.counters['5xx']}</div>
            </div>
          </div>
          <Sparkline data={rpmHistory} />
          <div className="mt-2 text-xs text-slate-500">
            Source: <code>/metrics</code> · auto-refresh 5s · since {since}
          </div>
        </>
      )}

      {!err && !m && <div className="mt-2 text-slate-500">loading</div>}
    </div>
  );
}
