import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";

["data/raw","data/processed","data/stac","data/mrv"].forEach(d=>!existsSync(d)&&mkdirSync(d,{recursive:true}));

const run = (cmd, desc) => { console.log(`⏳ ${desc}`); execSync(cmd, { stdio: "inherit" }); };

run("python src/adapters/effis/fetch_effis.py 2024 6 data/raw", "Fetch/fixture EFFIS");
run("python src/adapters/era5/resample.py data/raw/effis_202406.nc data/processed/effis_resampled.nc", "Resample");
run("python - <<'PY'\nfrom src.adapters.core.stac import make_stac_item\nimport json\nprint(json.dumps(make_stac_item('data/processed/effis_resampled.nc','effis_202406','fwi')))\nPY", "STAC item");
console.log("✅ EFFIS pipeline (offline) done");
