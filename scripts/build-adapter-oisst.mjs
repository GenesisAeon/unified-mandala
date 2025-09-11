import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";

const dirs = ["data/raw", "data/processed", "data/stac", "data/mrv"];
dirs.forEach((d) => !existsSync(d) && mkdirSync(d, { recursive: true }));

const raw_path = "data/raw/oisst_202301.nc";
const processed_path = "data/processed/oisst_202301_resampled.nc";
const mrv_path = "data/mrv/oisst_202301.parquet";

try {
  console.log("🌊 Fetching OISST...");
  execSync(`python src/adapters/oisst/fetch_oisst.py 2023 1 data/raw`, { stdio: "inherit" });

  console.log("📏 Resampling...");
  execSync(`python src/adapters/oisst/resample_oisst.py ${raw_path} ${processed_path}`, { stdio: "inherit" });

  console.log("🗃️  Generating STAC...");
  execSync(`python src/adapters/oisst/stac_oisst.py ${raw_path}`, { stdio: "inherit" });

  console.log("📊 Generating MRV...");
  execSync(`python src/adapters/oisst/mrv_oisst.py ${processed_path} ${mrv_path}`, { stdio: "inherit" });

  console.log("✨ Calculating CREP score...");
  const score = execSync(`python src/adapters/oisst/crep_score_oisst.py ${processed_path}`).toString().trim();
  console.log(`CREP Score: ${score}`);

  console.log("✅ OISST pipeline completed");
} catch (e) {
  console.error("❌ OISST build failed:", e.message);
  process.exit(1);
}
