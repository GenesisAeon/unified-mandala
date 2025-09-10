import { execSync } from "child_process";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import path from "path";

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

const DIRS = ["data/raw", "data/processed", "data/stac", "data/mrv"];
DIRS.forEach(d => !existsSync(d) && mkdirSync(d, { recursive: true }));

const variable = process.env.ERA5_VARIABLE ?? "2m_temperature";
const year = Number(process.env.ERA5_YEAR ?? 2024);
const month = Number(process.env.ERA5_MONTH ?? 9);

console.log(`→ ERA5 ${variable} ${year}-${month.toString().padStart(2,"0")}`);

run("python -V");
run(`python -m pip install -r src/adapters/era5/requirements.txt`);

const raw = `data/raw/era5_${variable}_${year}${month.toString().padStart(2,"0")}.nc`;
const resampled = `data/processed/era5_${variable}_${year}${month.toString().padStart(2,"0")}_05deg.nc`;
const stacOutDir = "data/stac";
const pq = `data/mrv/era5_${variable}_${year}${month.toString().padStart(2,"0")}.parquet`;

run(`python src/adapters/era5/fetch.py`);
run(`python - <<PY
from src.adapters.era5.stac import create_stac_item, save_item
p='${raw}'; v='${variable}'
i=create_stac_item(p,v); print(save_item(i,'${stacOutDir}'))
PY`);
run(`python src/adapters/era5/resample.py ${raw} ${resampled}`);
run(`python src/adapters/era5/mrv.py ${resampled} ${pq}`);
const score = execSync(`python src/adapters/era5/crep_score.py ${resampled}`).toString().trim();
writeFileSync(path.join("data","mrv",`era5_${variable}_${year}${month.toString().padStart(2,"0")}.score.txt`), score);
console.log("CREP:", score);
console.log("✅ ERA5 adapter pipeline done.");
