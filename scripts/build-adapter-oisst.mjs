import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";

const dirs = ["data/raw", "data/processed", "data/stac", "data/mrv"];
dirs.forEach((d) => !existsSync(d) && mkdirSync(d, { recursive: true }));

const run = (cmd, desc) => {
  console.log(`⏳ ${desc}…`);
  execSync(cmd, { stdio: "inherit", env: { ...process.env, CI: process.env.CI || "true" } });
};

try {
  run("python -m src.adapters.oisst.fetch_oisst 2023 1 data/raw", "Fetch OISST");
  run(
    "python -m src.adapters.oisst.resample_oisst data/raw/oisst_202301.nc data/processed/oisst_202301.nc",
    "Resample grid"
  );
  run(
    "python -m src.adapters.oisst.stac_oisst data/raw/oisst_202301.nc",
    "STAC"
  );
  run(
    "python -m src.adapters.oisst.mrv_oisst data/processed/oisst_202301.nc data/mrv/oisst_202301.parquet",
    "Export MRV"
  );
  run(
    "python -c \"from src.adapters.oisst.crep_score_oisst import calculate_crep_score; print('CREP', calculate_crep_score('data/processed/oisst_202301.nc'))\"",
    "CREP score"
  );
  console.log("✅ OISST pipeline abgeschlossen");
} catch (e) {
  console.error("❌ OISST pipeline failed");
  process.exit(1);
}
