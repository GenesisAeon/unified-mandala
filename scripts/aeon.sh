#!/bin/bash
# 🜂 AeonShell – poetisches Mandala CLI
cyan='\033[1;36m'; yellow='\033[1;33m'; green='\033[1;32m'; reset='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Service Endpunkte
ORC_URL="http://localhost:9000"
CHAT_URL="http://localhost:8102/chat"
CODE_URL="http://localhost:8200/code"
NN_URL="http://localhost:8300/nn"
NEWS_URL="http://localhost:8400/news"

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
    onboard_services – Wählt aktivierte Agentendienste
    chat            – Öffnet interaktives Chat-CLI
    code            – Ruft den CodeAgent auf
    nn              – Steuert AeonNeuralMembrane {start|stop|status}
    news            – Steuert NachrichtenBotTeam {start|stop|status}
    integrate       – Fraktale Pipeline Chat ▶ CodeAgent ▶ NN ▶ NewsBot
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
  echo -ne "\n${yellow}Möchtest du direkt einen ersten Chat mit deinem Mandala führen? (y/n)${reset} "
  read ans
  if [ "$ans" = "y" ]; then
    chat
  fi
}
function onboard_services() {
  node "$ROOT_DIR/scripts/onboard-services.js"
}

function chat() {
  echo -e "${green}💬 Chatbot-CLI (Ctrl-C zum Beenden)${reset}"
  while true; do
    read -p "You: " USER_IN || break
    [ -z "$USER_IN" ] && continue
    RESP=$(curl -s -X POST $CHAT_URL -H 'Content-Type: application/json' -d "{\"prompt\": \"$USER_IN\"}")
    echo "Bot: $(echo $RESP | jq -r '.text')"
  done
}

function code() {
  echo -e "${green}🛠️  CodeAgent-Workflow starten ...${reset}"
  RESP=$(curl -s -X POST $CODE_URL/optimize -H 'Content-Type: application/json' -d "{\"path\": \"$ROOT_DIR/packages\", \"mode\":\"refactor\"}")
  echo "CodeAgent sagt: $(echo $RESP | jq -r '.status')"
}

function nn() {
  ACTION=$1; shift
  case "$ACTION" in
    start)
      echo -e "${green}🚀 Starte AeonNeuralMembrane ...${reset}"
      curl -s $NN_URL/start && echo "Started" ;;
    stop)
      echo -e "${yellow}🛑 Stoppe AeonNeuralMembrane ...${reset}"
      curl -s $NN_URL/stop && echo "Stopped" ;;
    status)
      echo -e "${cyan}🔍 Status der AeonNeuralMembrane:${reset}"
      curl -s $NN_URL/status | jq ;;
    *)
      echo "Usage: aeon.sh nn {start|stop|status}" ;;
  esac
}

function news() {
  ACTION=$1; shift
  case "$ACTION" in
    start)
      echo -e "${green}🗞️  Starte NachrichtenBotTeam ...${reset}"
      curl -s $NEWS_URL/start && echo "Started" ;;
    stop)
      echo -e "${yellow}⛔ Stoppe NachrichtenBotTeam ...${reset}"
      curl -s $NEWS_URL/stop && echo "Stopped" ;;
    status)
      echo -e "${cyan}📡 Status des NachrichtenBotTeams:${reset}"
      curl -s $NEWS_URL/status | jq ;;
    *)
      echo "Usage: aeon.sh news {start|stop|status}" ;;
  esac
}

function integrate() {
  echo -e "${green}🔗 Integriere Chatbot ▶ CodeAgent ▶ NN ▶ NewsBot${reset}"
  read -p "Eingabe für Konversation: " Q
  CHAT_RES=$(curl -s -X POST $CHAT_URL -H 'Content-Type: application/json' -d "{\"prompt\": \"$Q\"}")
  TEXT=$(echo $CHAT_RES | jq -r '.text')
  echo "  → Chatbot: $TEXT"

  CODE_RES=$(curl -s -X POST $CODE_URL/optimize -H 'Content-Type: application/json' -d "{\"prompt\": \"$TEXT\", \"mode\":\"snippet\"}")
  echo "  → CodeAgent: $(echo $CODE_RES | jq -r '.status')"

  NN_RES=$(curl -s -X POST $NN_URL/evaluate -H 'Content-Type: application/json' -d "{\"input\": \"$TEXT\"}")
  echo "  → AeonNeuralMembrane CREP-Score: $(echo $NN_RES | jq -r '.crep_score')"

  NEWS_RES=$(curl -s -X POST $NEWS_URL/dispatch -H 'Content-Type: application/json' -d "{\"headline\": \"$TEXT\"}")
  echo "  → NewsBotTeam: $(echo $NEWS_RES | jq -r '.status')"
}
case "$1" in
  sigil_invoke) sigil_invoke ;;
  cycle_start) cycle_start ;;
  chronopoem) chronopoem ;;
  setup) setup ;;
  onboarding) onboarding ;;
  onboard_services) onboard_services ;;
  chat) chat ;;
  code) code ;;
  nn) shift; nn "$@" ;;
  news) shift; news "$@" ;;
  integrate) integrate ;;
  help|*) show_help ;;
esac
