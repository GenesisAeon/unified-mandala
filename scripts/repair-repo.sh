#!/bin/sh
# Repair repository settings for GitHub connectivity
if ! git remote | grep -q '^origin$'; then
  git remote add origin https://github.com/GenesisAeon/unified-mandala.git
fi

git symbolic-ref HEAD refs/heads/main

echo "Repository repaired."
