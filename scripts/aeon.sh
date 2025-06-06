#!/bin/bash
# 🜂 AeonShell – poetisches Mandala CLI
cyan='\033[1;36m'; yellow='\033[1;33m'; green='\033[1;32m'; reset='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

function sigil_invoke() {
  echo -e "${yellow}✴ Rufe den Dichter...${reset}"
  node "$ROOT_DIR/packages/cli-tools/export-doc.js"
}
function cycle_start() {
  echo -e "${green}⟳ Mandala-Kreislauf aktiviert. CREP-Tracking beginnt...${reset}"
  pnpm run dev
}
function show_help() {
  echo -e "${cyan}AeonShell – Befehle:${reset}
    sigil_invoke    – Ruft Poetik-/Archivfunktion
    cycle_start     – Startet lokalen Mandala-Zyklus
    chronopoem      – Erzeugt poetische Commit-Signatur
    setup           – Führt das Setup-Ritual aus
    onboarding      – Zeigt das Onboarding-Ritual
    help            – Diese Hilfe"
}
function chronopoem() {
  node "$ROOT_DIR/scripts/generate-chronopoem.js"
  cat "$ROOT_DIR/CHRONOPOEM.md"
}
function setup() {
  bash "$ROOT_DIR/scripts/setup-unifiedmandala.sh"
}
function onboarding() {
  cat "$ROOT_DIR/scripts/onboarding-ritual.md"
  echo -e "\n${yellow}Aktueller Chronopoem:${reset}"
  chronopoem
}
case "$1" in
  sigil_invoke) sigil_invoke ;;
  cycle_start) cycle_start ;;
  chronopoem) chronopoem ;;
  setup) setup ;;
  onboarding) onboarding ;;
  help|*) show_help ;;
esac
