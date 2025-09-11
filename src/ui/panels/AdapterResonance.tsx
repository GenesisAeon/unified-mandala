import React from "react";
import { interAdapterResonance } from "@resonance";
type P = { era5: number; oisst: number; minScore?: number };
export default function AdapterResonance({ era5, oisst, minScore = 0 }: P) {
  const gap = interAdapterResonance(era5, oisst);
  const ok = era5 >= minScore && oisst >= minScore;
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <div className="text-sm opacity-70">Adapter CREP</div>
      <div className="flex items-center gap-4">
        <div>ERA5: {era5.toFixed(2)}</div>
        <div>OISST: {oisst.toFixed(2)}</div>
        <div className="ml-auto">Δ: {gap.toFixed(2)}</div>
      </div>
      {!ok && (
        <div className="text-xs text-amber-600">
          Filter: minScore {minScore.toFixed(2)} nicht erfüllt
        </div>
      )}
    </div>
  );
}
