import { readFileSync } from "node:fs";
const item = JSON.parse(readFileSync("data/stac/era5_item.json", "utf8"));
if (!item.geometry || !item.assets) {
  console.error("STAC invalid: geometry/assets missing");
  process.exit(1);
}
console.log("STAC ok");
