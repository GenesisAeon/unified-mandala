#!/bin/sh
set -e
if [ ! -f charts/ghostshell/Chart.yaml ]; then
  echo "Chart.yaml missing"
  exit 1
fi
echo "Helm chart found"
