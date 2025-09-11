import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync("src/adapters/_schema/stac-item.json", "utf8"));
const validate = ajv.compile(schema);

const dir = "out/stac";
let ok = true;
for (const f of (fs.existsSync(dir) ? fs.readdirSync(dir) : [])) {
  if (!f.endsWith(".json")) continue;
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const valid = validate(data);
  if (!valid) {
    ok = false;
    console.error(`❌ STAC invalid: ${f}\n`, validate.errors);
  } else {
    console.log(`✅ STAC ok: ${f}`);
  }
}
process.exit(ok ? 0 : 1);
