import { useMemo, useState } from "react";
import type { Sigillin } from "../../types/sigillin";
import { FEATURES } from "../../config/featureFlags";

export default function EmergenceExplorer({ data }: { data: Sigillin[] }) {
  if (FEATURES.emergenceExplorer !== "on") return null;

  const [minScore, setMinScore] = useState(0.7);
  const nodes = useMemo(() => data.filter(s => (s.crep?.score ?? 0) >= minScore), [data, minScore]);

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">Emergence Explorer</h3>
        <label className="text-sm">CREP ≥ {minScore.toFixed(2)}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={minScore}
          onChange={e => setMinScore(parseFloat(e.target.value))}
        />
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {nodes.map(n => (
          <li key={n.id} className="border rounded p-2">
            <div className="font-medium">{n.name ?? n.id}</div>
            <div>score: {(n.crep?.score ?? 0).toFixed(2)}</div>
            <div>links: {n.connections?.length ?? 0}</div>
            <div>emergence: {n.metrics?.emergencePotential?.toFixed?.(2) ?? "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
