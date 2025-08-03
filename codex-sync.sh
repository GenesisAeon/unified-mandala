#!/usr/bin/env bash
set -euo pipefail

DIR=${1:-docs/sigils}
if [ ! -d "$DIR" ]; then
  echo "Directory $DIR not found" >&2
  exit 1
fi

echo "Computing Sigillin hashes in $DIR..."
for file in "$DIR"/*.yaml; do
  [ -e "$file" ] || continue
  hash=$(sha256sum "$file" | awk '{print $1}')
  echo "$(basename "$file") $hash"
done

if [ -n "${CREP:-}" ]; then
  echo "CREP check: $CREP"
else
  echo "CREP not set, skipping CREP check"
fi
