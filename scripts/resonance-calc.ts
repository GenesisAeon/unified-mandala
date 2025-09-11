import { interAdapterResonance } from "../src/utils/index.js";
const era5 = Number(process.env.ERA5_CREP ?? "0.82");
const oisst = Number(process.env.OISST_CREP ?? "0.91");
const r = interAdapterResonance(era5, oisst);
console.log(JSON.stringify({ era5, oisst, resonance: r }, null, 2));
