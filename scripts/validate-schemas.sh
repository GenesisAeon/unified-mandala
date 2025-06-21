#!/usr/bin/env bash
set -e
fail=0
printf "Validating JSON files...\n"
for f in $(git ls-files '*.json'); do
  node -e "const fs=require('fs');JSON.parse(fs.readFileSync('$f','utf8'));" 2>/dev/null || { echo "Invalid JSON: $f"; fail=1; }
done
printf "Validating YAML files...\n"
for f in $(git ls-files '*.yaml' '*.yml'); do
  node -e "const yaml=require('js-yaml');const fs=require('fs');yaml.load(fs.readFileSync('$f','utf8'));" 2>/dev/null || { echo "Invalid YAML: $f"; fail=1; }
done
if [ $fail -ne 0 ]; then
  echo "Schema validation failed" >&2
  exit 1
fi
echo "All schemas valid"
