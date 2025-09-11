import React from "react";
import { CREPBadge } from "./CREPBadge";
import { EmergenceBadge } from "./SigillinBadge";

export function SigillinCard({ sigillin }: { sigillin: any }) {
  return (
    <div className="border rounded p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{sigillin.name || sigillin.id}</h3>
        <div className="flex gap-2 items-center">
          <EmergenceBadge value={sigillin.metrics?.emergencePotential ?? 0} />
          {sigillin.crep?.score != null && <CREPBadge value={sigillin.crep.score} />}
        </div>
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
      {sigillin.metrics && (
        <div className="mt-2 text-xs">
          <span
            className={`inline-block px-2 py-0.5 rounded ${
              sigillin.metrics.class === "high"
                ? "bg-green-600 text-white"
                : sigillin.metrics.class === "medium"
                ? "bg-amber-500 text-white"
                : "bg-zinc-700 text-white"
            }`}
          >
            {sigillin.metrics.class.toUpperCase()}
          </span>
          {typeof sigillin.metrics.interAdapterResonance === "number" && (
            <span className="ml-2 opacity-80">
              Res: {sigillin.metrics.interAdapterResonance.toFixed(2)}
            </span>
          )}
        </div>
      )}
      {sigillin.metrics?.emergencePotential !== undefined && (
        <div className="text-xs opacity-80">r(ERA5, OISST): see correlations</div>
      )}
    </div>
  );
}
