# ProtoDeploy

Dieses Setup stellt eine minimale Docker-Compose-Umgebung bereit, um das Aeon-System lokal zu starten.

```bash
# Starten
./scripts/protodeploy.sh up

# Stoppen
./scripts/protodeploy.sh down
```

Der Dienst `aeon-core` nutzt `Dockerfile.dev` und bindet den Repository-Ordner ein. So kann die Entwicklungsumgebung auch offline genutzt werden.
