#!/bin/bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA="$ROOT_DIR/packages/genesis-sigillin-core/schemas/sigillin.schema.json"
EXIT=0
for file in "$ROOT_DIR"/docs/sigils/*.yaml; do
  [ -e "$file" ] || continue
  echo "Validating $file"
  node - <<NODE || EXIT=1
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const yaml = require('yaml');
const schema = JSON.parse(fs.readFileSync(path.resolve('$SCHEMA'), 'utf8'));
const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);
const data = yaml.parse(fs.readFileSync('$file', 'utf8'));
if (!validate(data)) { console.error(validate.errors); process.exit(1); }
NODE
done
if [ $EXIT -eq 0 ]; then
  echo "All sigillins valid"
else
  echo "Validation failed"
  exit 1
fi
