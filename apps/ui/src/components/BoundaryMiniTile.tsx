import React from 'react';

type LawsMeta = { violations: number; total: number; lastTs?: string };

async function fsRead(uri: string, encoding = 'utf8') {
  const r = await fetch('/api/tools/fs/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ uri, encoding }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error ?? `fs.read failed: ${r.status}`);
  return j;
}

export default function BoundaryMiniTile() {
  const [meta, setMeta] = React.useState<LawsMeta | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const primary = await fsRead('data://logs/boundary/laws.json').catch(() =>
          fsRead('data://logs/boundary/laws.demo.json'),
        );
        const text = primary?.text ?? primary?.data ?? '';
        if (!text) throw new Error('empty');
        const payload = JSON.parse(text);
        const laws = Array.isArray(payload?.laws) ? payload.laws : [];
        const violations = laws.filter((l: any) => l?.verdict === 'violation').length;
        const total = laws.length;
        const lastTs = payload?.generated_at;
        if (alive) setMeta({ violations, total, lastTs });
      } catch (e: any) {
        if (alive) setErr(e?.message ?? String(e));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <a
      href="/demo/boundary"
      className="block rounded-2xl border p-3 hover:shadow-sm transition bg-white"
      title="Boundary Alerts → zur Demo"
    >
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Boundary Alerts</div>
      {meta ? (
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold">
            {meta.violations}
            <span className="text-sm text-slate-500"> / {meta.total}</span>
          </div>
          <div className="text-xs text-slate-500 ml-auto">
            {meta.lastTs ? new Date(meta.lastTs).toLocaleTimeString() : ''}
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400">{err ? '-' : 'lädt'}</div>
      )}
      <div className="mt-2 h-1 rounded bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${meta && meta.violations > 0 ? 'bg-amber-400' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(100, (meta ? meta.violations / Math.max(1, meta.total) : 0) * 100)}%` }}
        />
      </div>
    </a>
  );
}

