# UnifiedMandala Orchestrator

Dieses Minimal-Setup stellt einen Scheduler und mehrere Microservices bereit, um
Sigillin-Events an spezialisierte neuronale Netze weiterzuleiten.

## Start

```bash
docker-compose up --build
```

## Sigillin-Event senden

```bash
curl -X POST http://localhost:9000/sigillin-event \
  -H "Content-Type: application/json" \
  -d '{"task_type":"graph_pattern","crep_score":0.77,"data":{"nodes":[]}}'
```

Logs zeigen CREP-Events und Routingentscheidungen.

### Erweiterung

- Eigene NN-Services in `nets/` ergänzen
- Schwellenwerte in `orchestrator/pipeline_config.yaml` anpassen
