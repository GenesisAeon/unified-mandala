#!/bin/bash

# Setup script for development environment
# Detect package manager and install required tools.

if command -v apt &> /dev/null; then
  sudo apt update
  sudo apt upgrade -y
  sudo apt install -y git curl wget build-essential python3 python3-pip nodejs npm
elif command -v brew &> /dev/null; then
  brew update
  brew upgrade
  brew install git curl wget python node
else
  echo "Kein unterst\u00fctzter Paketmanager gefunden (apt oder brew)."
  exit 1
fi

# Configure Git if not configured
if ! git config --global user.name >/dev/null; then
  git config --global user.name "your_name"
fi
if ! git config --global user.email >/dev/null; then
  git config --global user.email "your_email@example.com"
fi

echo "\nSetting up Python virtual environment";
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

echo "\nInstalling Node dependencies";
pnpm install || npm install

# Example VS Code configuration
if command -v code &> /dev/null; then
  code --install-extension ms-python.python >/dev/null 2>&1
  code --install-extension esbenp.prettier-vscode >/dev/null 2>&1
fi

echo "Entwicklungsumgebung erfolgreich eingerichtet!"
