import React from "react";
import { interAdapterResonance } from "../../utils";

export default function ResonancePanel({
  era5, oisst
}: { era5?: number; oisst?: number }) {
  if (process.env.VITE_FEATURE_RESONANCE !== "true") return null;
  const score = interAdapterResonance(era5 ?? 0, oisst ?? 0);
  const klass = score > 0.8 ? "high" : score > 0.5 ? "medium" : "low";
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Adapter Resonance</h3>
      <p className="mt-2">ERA5 ↔ OISST: <b>{score.toFixed(2)}</b> <span className={`badge ${klass}`}>{klass}</span></p>
    </div>
  );
}
