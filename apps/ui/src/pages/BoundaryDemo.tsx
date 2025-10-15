import React from 'react';
import BoundaryLawInsightsUI from '@mandala/boundary-ui';
import type { BoundaryObservation } from '@mandala/boundary-core';

type LawsPayload = {
  generated_at: string;
  rules_count: number;
  observations_count: number;
  violations_count: number;
  summary?: { ok: number; warn: number; error: number };
  laws: BoundaryObservation[];
};

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

async function fsList(uri: string) {
  const r = await fetch('/api/tools/fs/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ uri }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error ?? `fs.list failed: ${r.status}`);
  return j as { uri: string; count: number; items: string[] };
}

async function fsWrite(uri: string, text: string) {
  const r = await fetch('/api/tools/fs/write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ uri, content: text, encoding: 'utf8' }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error ?? `fs.write failed: ${r.status}`);
  return j;
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function BoundaryDemo() {
  const [laws, setLaws] = React.useState<BoundaryObservation[]>([]);
  const [meta, setMeta] = React.useState<{ generated?: string; summary?: LawsPayload['summary'] } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<string>('');
  const [autoRag, setAutoRag] = React.useState<boolean>(false);
  const [ragBadge, setRagBadge] = React.useState<string>('');

  const candidates = React.useMemo(() => [
    'data://logs/boundary/laws.json',
    'data://logs/boundary/laws.demo.json',
  ], []);

  const loadLatest = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let text: string | null = null;
      for (const uri of candidates) {
        try {
          const j = await fsRead(uri);
          text = j?.text ?? j?.data ?? null;
          if (text) break;
        } catch {}
      }
      if (!text) {
        try {
          const l = await fsList('data://logs/boundary');
          const picks = (l.items || []).filter((p) => /laws.*\.json$/i.test(p));
          if (picks.length) {
            picks.sort();
            const pick = picks[picks.length - 1];
            const j2 = await fsRead(pick);
            text = j2?.text ?? j2?.data ?? null;
          }
        } catch {}
      }
      if (!text) throw new Error('Keine Boundary-Snapshots gefunden. Bitte CLI laufen lassen: pnpm boundary:demo');
      const payload = JSON.parse(text) as LawsPayload;
      setLaws(Array.isArray(payload.laws) ? payload.laws : []);
      setMeta({ generated: payload.generated_at, summary: payload.summary });
      if (autoRag) {
        try {
          await ragIndexAppend();
        } catch (e: any) {
          setNote(`RAG-Index: ${e?.message ?? e}`);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setLaws([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [candidates, autoRag]);

  async function ragIndexAppend() {
    const r = await fetch('/api/tools/rag/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        roots: 'data://logs/boundary',
        exts: ['.json', '.yaml', '.yml'],
        fresh: false,
      }),
    });
    if (!r.ok) throw new Error(`rag.index append failed: ${r.status}`);
    const ts = new Date().toLocaleTimeString();
    setRagBadge(`RAG ok ✓ (${ts})`);
    setTimeout(() => setRagBadge(''), 3500);
  }

  React.useEffect(() => {
    void loadLatest();
  }, [loadLatest]);

  async function generateDemoSnapshot() {
    try {
      setLoading(true);
      setError(null);
      const now = new Date().toISOString();
      const demo: LawsPayload = {
        generated_at: now,
        rules_count: 2,
        observations_count: 2,
        violations_count: 1,
        summary: { ok: 1, warn: 1, error: 0 },
        laws: [
          {
            ts: now,
            source: 'README.md',
            ruleId: 'no-todo',
            verdict: 'violation',
            details: 'Matched pattern: \\bTODO\\b',
            severity: 'warn',
          },
          {
            ts: now,
            source: 'README.md',
            ruleId: 'no-secret',
            verdict: 'pass',
            details: 'No match',
            severity: 'error',
          },
        ],
      };
      await fsWrite('data://logs/boundary/laws.demo.json', JSON.stringify(demo, null, 2));
      setNote('Demo-Snapshot gespeichert.');
      setTimeout(() => setNote(''), 2200);
      await loadLatest();
      if (autoRag) {
        try {
          await ragIndexAppend();
        } catch (e: any) {
          setNote(`RAG-Index: ${e?.message ?? e}`);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  const badges = (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {meta?.summary?.ok ?? 0}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-1">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        {meta?.summary?.warn ?? 0}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-2 py-1">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        {meta?.summary?.error ?? 0}
      </span>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Boundary · Demo</h1>
          <div className="text-sm text-slate-600">
            {meta?.generated ? <>Letzter Snapshot: {new Date(meta.generated).toLocaleString()}</> : 'Lädt'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadLatest()}
            disabled={loading}
            className={classNames(
              'rounded-xl px-3 py-2 border',
              loading ? 'bg-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white hover:bg-slate-50',
            )}
            title="Reload latest laws.json"
          >
            Reload
          </button>
          <button
            onClick={() => void generateDemoSnapshot()}
            disabled={loading}
            className={classNames(
              'rounded-xl px-3 py-2',
              loading ? 'bg-slate-300 text-slate-700 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800',
            )}
            title="Generate a demo snapshot into data://logs/boundary/laws.demo.json"
          >
            Demo-Snapshot
          </button>
          <label className="ml-3 inline-flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={autoRag}
              onChange={(e) => setAutoRag(e.target.checked)}
            />
            Auto-index RAG (boundary)
          </label>
        </div>
      </div>

      {note && <div className="rounded-xl bg-slate-900 text-white px-3 py-2 text-xs">{note}</div>}
      {error && <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
      {badges}
      {ragBadge && <div className="text-xs text-emerald-700">{ragBadge}</div>}

      <div className="rounded-xl border">
        <BoundaryLawInsightsUI laws={laws} loading={loading} error={error} onScan={() => void loadLatest()} />
      </div>

      <div className="text-xs text-slate-500">
        Tipp: Erzeuge echte Daten mit <code>pnpm boundary:demo</code> oder <code>pnpm boundary:run --scan README.md</code>.
        Die Seite lädt automatisch <code>data://logs/boundary/laws.json</code> (Fallback: <code>laws.demo.json</code>).
      </div>
    </div>
  );
}
