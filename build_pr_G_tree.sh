#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
mkdir -p "$ROOT/infrastructure/otel"

cat >"$ROOT/infrastructure/otel/docker-compose.yml" <<'EOD'
version: '3.8'
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.108.0
    command: ["--config=/etc/otelcol/config.yaml"]
    volumes:
      - ./otel-config.yaml:/etc/otelcol/config.yaml:ro
    ports:
      - "4318:4318"
  jaeger:
    image: jaegertracing/all-in-one:1.57
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "16686:16686"
      - "4317:4317"
      - "4318:4318"
EOD

cat >"$ROOT/infrastructure/otel/otel-config.yaml" <<'EOC'
receivers:
  otlp:
    protocols:
      http:

exporters:
  jaeger:
    endpoint: http://jaeger:14268/api/traces
    tls:
      insecure: true
  logging:
    loglevel: info

processors:
  batch:

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging, jaeger]
EOC

echo "PR-G tree written under $ROOT"
