#!/usr/bin/env bash
# Red Team Day exercise bootstrap script
set -euo pipefail

usage() {
  echo "Usage: $0 [start|cleanup]" >&2
}

action=${1:-start}

case "$action" in
  start)
    echo "[Red Team Day] Applying baseline network restrictions..."
    if command -v kubectl >/dev/null 2>&1; then
      kubectl apply -f cilium/policies/default-deny.yaml || echo "Policy apply skipped"
    else
      echo "kubectl not found, skipping k8s policy apply"
    fi
    echo "[Red Team Day] Environment ready."
    ;;
  cleanup)
    echo "[Red Team Day] Cleaning up exercise resources..."
    if command -v kubectl >/dev/null 2>&1; then
      kubectl delete -f cilium/policies/default-deny.yaml || echo "Policy delete skipped"
    else
      echo "kubectl not found, skipping k8s policy delete"
    fi
    echo "[Red Team Day] Cleanup complete."
    ;;
  *)
    usage
    exit 1
    ;;
 esac
