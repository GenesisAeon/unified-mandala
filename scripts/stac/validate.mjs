import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync("src/adapters/_schema/stac-item.schema.json", "utf8")
);
const validate = ajv.compile(schema);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) yield full;
  }
}

const targets = ["data/stac", "out/stac"].filter(fs.existsSync);
let errors = [];

for (const t of targets) {
  for (const file of walk(t)) {
    const obj = JSON.parse(fs.readFileSync(file, "utf8"));
    const ok = validate(obj);
    if (!ok) errors.push({ file, errors: validate.errors ?? [] });
  }
}

if (errors.length) {
  fs.mkdirSync("out", { recursive: true });
  fs.writeFileSync(
    "out/stac_validation_errors.json",
    JSON.stringify(errors, null, 2)
  );
  console.error("❌ STAC validation failed. See out/stac_validation_errors.json");
  process.exit(1);
}
console.log("✅ STAC validation passed");
