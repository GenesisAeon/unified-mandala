#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

pnpm test
pnpm vitest run

(cd go-agent && go test ./cmd/... ./internal/... ./pkg/... ./test)
(cd go-bridge && go test ./cmd/... ./pkg/... ./api/... ./test)
(cd services/vector-indexer && go test ./...)
