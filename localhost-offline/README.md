# Localhost-Offline-Paket

Dieses Paket stellt eine kleine Docker-Compose Umgebung bereit, um UnifiedMandala komplett offline auf dem eigenen Rechner zu betreiben. Die enthaltenen Services sind bereits gebaut und koennen ohne Internet gestartet werden.

## Setup

1. Kopiere den Ordner `localhost-offline` in dein Projekt.
2. Erstelle eine `.env` basierend auf der Datei `.env.example`.
3. Baue und starte alle Container:

```bash
cd localhost-offline
docker-compose build
docker-compose up -d
```

Danach erreichst du das Frontend unter `http://localhost:8080`.

## Services

- **web**: Statisches React-Frontend.
- **api**: Node.js REST- und gRPC-API.
- **nats**: Lokaler NATS-Server.
- **aeon-universal**: DSL-Compiler-Service.
- **offline-gpt**: Einfacher LLM-Mock fuer lokale Tests.

Alle fertigen Builds liegen bereits in den jeweiligen `dist` beziehungsweise `build` Ordnern.
