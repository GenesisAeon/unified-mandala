import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

const schema = JSON.parse(fs.readFileSync("src/adapters/_schema/stac.json", "utf8"));
const validate = ajv.compile(schema);

const dir = "data/stac";
let ok = true;
for (const f of (fs.existsSync(dir) ? fs.readdirSync(dir) : [])) {
  if (!f.endsWith(".json")) continue;
  const obj = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const valid = validate(obj);
  if (!valid) {
    ok = false;
    console.error(`❌ STAC invalid: ${f}`, validate.errors);
  }
}
if (!ok) process.exit(1);
console.log("✅ STAC valid");
