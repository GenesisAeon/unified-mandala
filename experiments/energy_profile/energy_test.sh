#!/bin/bash
# Starte Containers
docker-compose up -d snn_service lstm_service
# Metriken sammeln
for i in {1..100}; do
  docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemUsage}}" snn_service >> snn_stats.log
  docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemUsage}}" lstm_service >> lstm_stats.log
  sleep 1
done
