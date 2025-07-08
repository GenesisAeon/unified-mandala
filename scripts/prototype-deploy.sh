#!/bin/bash
# Prototype deployment environment for Aeon services
COMPOSE_FILE="$(dirname "$0")/../infrastructure/protodeploy/docker-compose.yml"

docker-compose -f "$COMPOSE_FILE" "$@"
