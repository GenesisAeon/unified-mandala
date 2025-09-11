import { useMemo, useState } from "react";
import type { Sigillin } from "../../types/sigillin";

type Edge = { source: string; target: string };

export default function EmergenceExplorer({ data }: { data: Sigillin[] }) {
  const [minScore, setMinScore] = useState(0.0);

  const nodes = useMemo(
    () => data
      .filter(s => (s.crep?.score ?? 0) >= minScore)
      .map(s => ({ id: s.id, score: s.crep?.score ?? 0 })),
    [data, minScore]
  );

  const edges: Edge[] = useMemo(() => {
    const ids = new Set(nodes.map(n => n.id));
    const list: Edge[] = [];
    data.forEach(s => {
      if (!ids.has(s.id)) return;
      (s.connections ?? []).forEach(t => {
        if (ids.has(t)) list.push({ source: s.id, target: t });
      });
    });
    return list;
  }, [data, nodes]);

  return (
    <section className="space-y-3">
      <header className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">Emergence Explorer</h3>
        <label className="text-sm">
          CREP ≥ {minScore.toFixed(2)}
          <input
            className="ml-2"
            type="range" min={0} max={1} step={0.05}
            value={minScore}
            onChange={(e) => setMinScore(parseFloat(e.currentTarget.value))}
          />
        </label>
      </header>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <h4 className="font-medium mb-2">Nodes ({nodes.length})</h4>
          <ul className="text-sm max-h-64 overflow-auto">
            {nodes.map(n => (
              <li key={n.id}>
                <span className="font-mono">{n.id}</span>
                <span className="opacity-70"> — {n.score.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded p-3">
          <h4 className="font-medium mb-2">Edges ({edges.length})</h4>
          <ul className="text-sm max-h-64 overflow-auto">
            {edges.map((e, i) => (
              <li key={i} className="font-mono">{e.source} → {e.target}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs opacity-70">
        (Minimaler Prototyp ohne D3; später Force-Layout & Live-Updates hinter Flag.)
      </p>
    </section>
  );
}
