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

export default function SigillinIndexPanel() {
  const [source, setSource] = useState<"all" | "era5" | "oisst">("all");
  const list = data?.sigils ?? [];
  const filtered = list.filter((s: any) =>
    source === "all" ? true : s.sourceId === source
  );
  const items = filtered.slice(0, 500);
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4 text-sm">
        <span>Quelle:</span>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as any)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">all</option>
          <option value="era5">era5</option>
          <option value="oisst">oisst</option>
        </select>
        <span className="ml-auto text-xs opacity-70">
          ERA5 (Atmosphäre), OISST (Ozean)
        </span>
      </div>
      <div className="grid gap-3">
        {items.map((s: any) => (
          <SigillinCard key={s.id} sigillin={s} />
        ))}
      </div>
    </div>
  );
}
