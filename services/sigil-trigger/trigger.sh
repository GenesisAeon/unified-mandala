#!/bin/bash
set -e
WATCH_DIR=${1:-docs/sigils}
CMD="node packages/cli-tools/sigillin-cli.js graph --json"

echo "Watching $WATCH_DIR for sigil changes..."

inotifywait -m -e close_write,create,delete "$WATCH_DIR" | while read -r path action file; do
  if [[ "$file" == *.sigil.json ]]; then
    echo "[sigil-trigger] $file changed -> regenerate graph"
    $CMD >/dev/null 2>&1 || echo "failed to run sigillin-cli"
  fi
done
