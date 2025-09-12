import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const env = { ...process.env, PYTHONPATH: "src", CI: process.env.CI || "true", ALLOW_NET: process.env.ALLOW_NET || "0" };
mkdirSync("data/raw", { recursive: true });
mkdirSync("data/processed", { recursive: true });
mkdirSync("out/stac", { recursive: true });
mkdirSync("out/metrics", { recursive: true });
mkdirSync("out", { recursive: true });

// 1) Fetch (synthetic offline)
let r = spawnSync("python", ["-m", "adapters.oisst.fetch_oisst", "2023", "1", "data/raw"], { stdio: "inherit", env });
if (r.status !== 0) process.exit(r.status);

// Raw-Datei finden (oisst_*.nc in data/raw)
const raw = readDirFirst("data/raw", (n) => n.startsWith("oisst_") && n.endsWith(".nc"));
if (!raw) die("no raw oisst_*.nc produced");

const rawPath = join("data/raw", raw);

// 2) Postprocess → processed .nc, STAC item, metrics
r = spawnSync("python", ["-m", "adapters.oisst.postprocess_oisst", rawPath, "data/processed", "out/stac", "out/metrics"], { stdio: "inherit", env });
if (r.status !== 0) process.exit(r.status);

// 3) adapters_index.json aktualisieren
const stamp = raw.replace("oisst_", "").replace(".nc", "");
const itemId = `oisst-${stamp}`;
const stacPath = `out/stac/${itemId}.item.json`;
const metricsPath = `out/metrics/${itemId}.metrics.json`;
if (!existsSync(stacPath)) die(`missing STAC: ${stacPath}`);
if (!existsSync(metricsPath)) die(`missing metrics: ${metricsPath}`);

const indexPath = "out/adapters_index.json";
let index = { adapters: [] };
if (existsSync(indexPath)) {
  try { index = JSON.parse(readFileSync(indexPath, "utf8")); } catch {}
}
index.adapters = Array.isArray(index.adapters) ? index.adapters.filter(a => a.id !== itemId) : [];
const metrics = JSON.parse(readFileSync(metricsPath, "utf8"));
index.adapters.push({
  id: itemId,
  kind: "oisst",
  stac: stacPath,
  crep: metrics.crep,
  processed: `data/processed/oisst_${stamp}.nc`
});
writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log("✅ OISST pipeline complete");

function readDirFirst(dir, predicate) {
  try {
    const list = readdirSync(dir);
    return list.find(predicate);
  } catch { return undefined; }
}
function die(msg) { console.error(`❌ ${msg}`); process.exit(1); }
