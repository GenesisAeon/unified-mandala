import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";

const dirs = ["data/raw","data/processed","data/stac","data/mrv","out"];
dirs.forEach(d=>{ if(!existsSync(d)) mkdirSync(d,{recursive:true}); });

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

try {
  console.log("\u23F3 ERA5 fetch…");        run("python src/adapters/era5/fetch.py");
  console.log("\u23F3 STAC metadata…");     run("python src/adapters/era5/stac.py");
  console.log("\u23F3 Resample…");          run("python src/adapters/era5/resample.py");
  console.log("\u23F3 MRV export…");        run("python src/adapters/era5/mrv.py");
  console.log("\u23F3 CREP score…");        run("python src/adapters/era5/crep_score.py");
  console.log("\u2705 ERA5 adapter pipeline complete");
} catch (e) {
  console.error("\u274C ERA5 build failed"); process.exit(1);
}
