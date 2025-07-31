#!/bin/bash
set -e

if command -v apt &>/dev/null; then
  sudo apt update && sudo apt install -y git nodejs npm python3 python3-pip
fi

pnpm install
poetry install --with test

echo "Environment ready"
