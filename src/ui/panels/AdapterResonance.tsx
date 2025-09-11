import React from "react";

type Pair = { era5: string; oisst: string; resonance: number };

export default function AdapterResonancePanel() {
  const [pairs, setPairs] = React.useState<Pair[]>([]);
  React.useEffect(() => {
    fetch("/out/adapter_resonance.json")
      .then((r) => r.json())
      .then((d) => setPairs(d.pairs ?? []))
      .catch(() => setPairs([]));
  }, []);
  if (!pairs.length) return <div className="text-sm opacity-70">no adapter resonance data</div>;
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">Adapter Resonance (ERA5 ↔ OISST)</h3>
      <div className="grid grid-cols-1 gap-2">
        {pairs.slice(0, 24).map((p, i) => {
          const pct = Math.round(p.resonance * 100);
          return (
            <div key={i} className="flex items-center justify-between border rounded-xl p-2">
              <div className="text-xs">
                {p.era5} ⇄ {p.oisst}
              </div>
              <div className="text-xs font-medium">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
