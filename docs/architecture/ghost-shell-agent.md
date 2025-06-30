# GhostShellAgent

Diese Komponente stellt einen skalierbaren WebSocket-Dienst bereit. Sie nutzt das Node.js-Cluster-Modul, optional einen Reverse Proxy und stellt Metriken via Prometheus zur Verfügung. Die Authentifizierung erfolgt über JSON Web Tokens.

## Features
* Clusterbetrieb mittels `cluster`-API
* JWT-Authentifizierung für Socket.io
* Ratenbegrenzung über `rate-limiter-flexible`
* Strukturierte Logs mit `pino`
* Prometheus-Metriken unter `/metrics`
* Beispielhafter Echo-Channel
