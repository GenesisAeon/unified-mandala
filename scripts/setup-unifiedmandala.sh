#!/bin/bash
echo "🜂 Setup – UnifiedMandala"
pnpm install
pnpm run build
pnpm test
pnpm run docs:build || echo "Dokumentation kann später gebaut werden."
echo "✔ Setup fertig. Starte jetzt mit ./scripts/aeon.sh cycle_start"
