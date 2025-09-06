#!/usr/bin/env bash
set -euo pipefail
BASE=${1:-http://localhost:3000}
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/"       | grep 200
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/healthz" | grep 200
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/readyz"  | egrep "204|503"
echo "[smoke] OK"
