import React from "react";
import { CREPBadge } from "./CREPBadge";

export function SigillinCard({ sigillin }: { sigillin: any }) {
  return (
    <div className="border rounded p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{sigillin.name || sigillin.id}</h3>
        {sigillin.crep?.score != null && <CREPBadge value={sigillin.crep.score} />}
      </div>
      <pre className="text-xs opacity-70 overflow-auto">{JSON.stringify(sigillin.connections ?? [], null, 2)}</pre>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt>Connection Density</dt>
        <dd>{(sigillin.metrics?.connectionDensity ?? 0).toFixed(2)}</dd>
        <dt>Emergence Potential</dt>
        <dd>{(sigillin.metrics?.emergencePotential ?? 0).toFixed(2)}</dd>
        <dt>Lifecycle</dt>
        <dd>{sigillin.metrics?.lifecycle ?? "beta"}</dd>
      </dl>
    </div>
  );
}
