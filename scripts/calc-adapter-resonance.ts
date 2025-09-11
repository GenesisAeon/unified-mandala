import fs from "fs";
import { interAdapterResonance } from "../src/utils/resonance";

type AdapterScore = { id: string; source: string; crepScore?: number };

type Index = { adapters?: AdapterScore[] };

const index: Index = JSON.parse(fs.readFileSync("out/sigillin_index.json", "utf8"));
const adapters = index.adapters ?? [];
const era5 = adapters.filter(a => a.source === "era5" && typeof a.crepScore === "number");
const oisst = adapters.filter(a => a.source === "oisst" && typeof a.crepScore === "number");
const pairs: any[] = [];
for (const e of era5) {
  for (const o of oisst) {
    pairs.push({
      era5: e.id,
      oisst: o.id,
      resonance: interAdapterResonance(e.crepScore ?? 0, o.crepScore ?? 0)
    });
  }
}
fs.mkdirSync("out", { recursive: true });
fs.writeFileSync("out/adapter_resonance.json", JSON.stringify({ pairs }, null, 2));
console.log(`✅ wrote out/adapter_resonance.json with ${pairs.length} pairs`);
