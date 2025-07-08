#!/bin/bash
COMPOSE_FILE="$(dirname "$0")/../infrastructure/protodeploy/docker-compose.yml"

docker-compose -f "$COMPOSE_FILE" "$@"
