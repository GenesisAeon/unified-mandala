import fs from "node:fs";
import { sync as globSync } from "glob";

const files = globSync("**/*.{md,ts,tsx,mjs,yaml,json}", {
  ignore: ["**/node_modules/**", "**/dist/**"]
});

const index = files.map((p) => ({ path: p, size: fs.statSync(p).size }));

fs.mkdirSync("out", { recursive: true });
fs.writeFileSync("out/sitemap.json", JSON.stringify(index, null, 2));
console.log("✅ wrote out/sitemap.json");
