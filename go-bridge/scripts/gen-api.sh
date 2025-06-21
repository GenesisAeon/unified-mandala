#!/usr/bin/env bash
set -euo pipefail

# Fetch OpenAPI spec
curl -sSL https://api.mandala.local/docs/openapi.yaml -o api/openapi.yaml

# Generate REST client (placeholder, requires oapi-codegen)
# oapi-codegen -generate "client" -package client -o pkg/client/openapi_client.gen.go api/openapi.yaml

# Generate Protobuf code
echo "Generating Protobuf code..."
protoc --go_out=api/proto --go-grpc_out=api/proto api/proto/*.proto
