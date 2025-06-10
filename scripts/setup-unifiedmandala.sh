#!/bin/bash
echo "🜂 Setup – UnifiedMandala"
pnpm install
pnpm lint
pnpm run build
pnpm test
pnpm run docs:build || echo "Dokumentation kann später gebaut werden."
CHUNK_SIZE=${CONV_CHUNK_SIZE:-50}
pnpm split:conversations "$CHUNK_SIZE" || echo "conversations.json bleibt ungeteilt."
echo "✔ Setup fertig. Starte jetzt mit ./scripts/aeon.sh cycle_start"
