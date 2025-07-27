# Unified Mandala Neural Networks

Dieses Modul bündelt verschiedene neuronale Netztypen in einem Docker-Compose Setup.

## Aufbau

- **gnn_hgnn**: Beispiel für ein Graph Neural Network
- **snn_haptic**: Spiking Neural Network zur Haptik-Simulation
- **liquid_net**: Liquid Time-Constant Network
- **kan_physics**: Kernel-based Approximation Network

## Starten

Alle Dienste lassen sich gemeinsam mit

```bash
docker-compose up --build
```

starten. Die Modelle können auch einzeln verwendet werden. Beispiel-Daten befinden sich unter `gnn_hgnn/data`.
