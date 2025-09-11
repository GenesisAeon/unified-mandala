import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";

["data/raw","data/processed","data/stac","data/mrv"].forEach(d=>!existsSync(d)&&mkdirSync(d,{recursive:true}));

const steps = [
  'python src/adapters/oisst/fetch_oisst.py 2023 01 data/raw',
  'python src/adapters/oisst/stac.py',
  'python src/adapters/oisst/resample.py',
  'python src/adapters/oisst/mrv.py',
  'python -c "from src.adapters.oisst.crep_score import calculate_crep_score; print(calculate_crep_score(\'data/processed/oisst_202301_resampled.nc\'))"'
];

for (const cmd of steps) {
  execSync(cmd, { stdio: "inherit", env: { ...process.env, NO_NETWORK: process.env.NO_NETWORK || "1" } });
}
console.log("✅ OISST pipeline done");
