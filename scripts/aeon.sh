#!/bin/bash
# 🜂 AeonShell – poetisches Mandala CLI
cyan='\033[1;36m'; yellow='\033[1;33m'; green='\033[1;32m'; reset='\033[0m'

function sigil_invoke() {
  echo -e "${yellow}✴ Rufe den Dichter...${reset}"
  node ../packages/cli-tools/export-doc.js
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
  node ../scripts/generate-chronopoem.js
  cat ../CHRONOPOEM.md
}
function setup() {
  bash ../scripts/setup-unifiedmandala.sh
}
function onboarding() {
  cat ../scripts/onboarding-ritual.md
}
case "$1" in
  sigil_invoke) sigil_invoke ;;
  cycle_start) cycle_start ;;
  chronopoem) chronopoem ;;
  setup) setup ;;
  onboarding) onboarding ;;
  help|*) show_help ;;
esac
