import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
mkdirSync("data/raw", { recursive: true });

const env = { ...process.env, PYTHONPATH: "src", CI: process.env.CI || "true", ALLOW_NET: process.env.ALLOW_NET || "0" };

// write synthetic or live (live not implemented → raises)
const r = spawnSync("python", ["-m", "adapters.oisst.fetch_oisst", "2023", "1", "data/raw"], { stdio: "inherit", env });
if (r.status !== 0) process.exit(r.status);

// hier ggf. weitere Steps (resample/STAC/MRV) anhängen

