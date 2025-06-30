#!/bin/bash
set -euo pipefail

DEST="${BACKUP_DEST:-./backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$DEST"
ARCHIVE="$DEST/backup-$TIMESTAMP.tar.gz"

FILES=()
[ -f plugins/mandalaHaiku/customPatterns.json ] && FILES+=("plugins/mandalaHaiku/customPatterns.json")
[ -f data/haikuVotes.json ] && FILES+=("data/haikuVotes.json")
[ -f services/ghost-shell/sessions.json ] && FILES+=("services/ghost-shell/sessions.json")

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Nothing to backup" >&2
  exit 0
fi

tar czf "$ARCHIVE" "${FILES[@]}"

if [ -n "${S3_BUCKET:-}" ] && command -v aws >/dev/null 2>&1; then
  aws s3 cp "$ARCHIVE" "s3://$S3_BUCKET/" || echo "S3 upload failed" >&2
fi
