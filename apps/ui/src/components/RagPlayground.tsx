import { useMemo, useState } from "react";

type State = "idle" | "loading" | "done" | "error";

function ragBase(): string {
  const base = (import.meta as any)?.env?.VITE_RAG_BASE;
  if (typeof base === "string" && base.trim()) return base.trim();
  return "/rag"; // proxied by Vite to RAG API
}

export default function RagPlayground() {
  const base = useMemo(ragBase, []);
  const [q, setQ] = useState("");
  const [k, setK] = useState(5);
  const [resp, setResp] = useState<any>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function search() {
    if (!q.trim()) return;
    setState("loading");
    setError(null);
    setResp(null);
    try {
      const url = `${base}/search?q=${encodeURIComponent(q)}&k=${k}`;
      const r = await fetch(url);
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
      setResp(json);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  async function ask() {
    if (!q.trim()) return;
    setState("loading");
    setError(null);
    setResp(null);
    try {
      const r = await fetch(`${base}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, k }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
      setResp(json);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">RAG Playground</h1>
        <p className="text-sm text-slate-600">Suche in Vektorstore und stelle Retrieval‑Fragen.</p>
      </header>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">Frage / Query</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl border border-slate-200 p-3 shadow-sm focus:border-indigo-500 focus:outline-none"
          placeholder="z. B. Was sagt Dokument X zu …?"
        />
      </label>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700">Top‑K</label>
        <input
          type="number"
          value={k}
          min={1}
          max={20}
          onChange={(e) => setK(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          className="w-20 rounded-xl border border-slate-200 p-2 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={search}
          disabled={state === "loading" || !q.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-slate-600 px-4 py-2 font-medium text-white shadow transition hover:bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Search
        </button>
        <button
          type="button"
          onClick={ask}
          disabled={state === "loading" || !q.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          Ask
        </button>
      </div>

      {state === "error" && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {state === "done" && (
        <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-900">
          {JSON.stringify(resp, null, 2)}
        </pre>
      )}
    </div>
  );
}

