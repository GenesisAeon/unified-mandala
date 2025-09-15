#!/bin/bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA="$ROOT_DIR/packages/genesis-sigillin-core/schemas/sigillin.schema.json"
EXIT=0
for file in "$ROOT_DIR"/docs/sigils/*.yaml; do
  [ -e "$file" ] || continue
  echo "Validating $file"
  SCHEMA_PATH="$SCHEMA" FILE_PATH="$file" node <<'NODE' || EXIT=1
const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const yaml = require('yaml');
const schemaPath = process.env.SCHEMA_PATH;
const filePath = process.env.FILE_PATH;
if (!schemaPath) {
  console.error('Schema path missing');
  process.exit(1);
}
const schema = require(schemaPath);
const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);
const data = yaml.parse(fs.readFileSync(filePath, 'utf8'));
if (!validate(data)) { console.error(validate.errors); process.exit(1); }
NODE
done
if [ $EXIT -eq 0 ]; then
  echo "All sigillins valid"
else
  echo "Validation failed"
  exit 1
fi
