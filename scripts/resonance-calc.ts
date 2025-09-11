import { interAdapterResonance } from "../src/utils/crep.ts";
import { readFileSync } from "node:fs";

const era5 = JSON.parse(readFileSync("out/era5_crep.json", "utf8")).score ?? 0;
const oisst = JSON.parse(readFileSync("out/oisst_crep.json", "utf8")).score ?? 0;

const delta = interAdapterResonance(era5, oisst);
console.log(JSON.stringify({ era5, oisst, resonanceGap: delta }, null, 2));
process.exit(0);
