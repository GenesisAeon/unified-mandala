import React, { useState } from "react";
// @ts-ignore
const data: any = (() => {
  try {
    return require("../../out/sigillin_index.json");
  } catch {
    return {};
  }
})();
import { SigillinCard } from "../components/SigillinCard";
import AdapterResonancePanel from "./AdapterResonance";

export default function SigillinIndexPanel() {
  const [source, setSource] = useState<string>("all");
  const [klass, setKlass] = useState<string>("all");
  const list = data?.sigils ?? [];
  const filtered = list.filter(
    (s: any) =>
      (source === "all" || s.sourceId === source) &&
      (klass === "all" || (s.metrics?.emergenceClass ?? "low") === klass)
  );
  const items = filtered.slice(0, 500);
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4 text-sm">
        <span>Quelle:</span>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">all</option>
          <option value="era5">era5</option>
          <option value="oisst">oisst</option>
          <option value="effis">effis</option>
        </select>
        <span>Klasse:</span>
        <select
          value={klass}
          onChange={(e) => setKlass(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">all</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <span className="ml-auto text-xs opacity-70">
          ERA5 (Atmosphäre), OISST (Ozean), EFFIS (Feuer)
        </span>
      </div>
      <AdapterResonancePanel />
      <div className="grid gap-3">
        {items.map((s: any) => (
          <SigillinCard key={s.id} sigillin={s} />
        ))}
      </div>
    </div>
  );
}
