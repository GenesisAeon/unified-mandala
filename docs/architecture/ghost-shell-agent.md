# GhostShellAgent

Diese Komponente stellt einen skalierbaren WebSocket-Dienst bereit. Sie nutzt das Node.js-Cluster-Modul, optional einen Reverse Proxy und stellt Metriken via Prometheus zur Verfügung. Die Authentifizierung erfolgt über JSON Web Tokens.

## Features
* Clusterbetrieb mittels `cluster`-API
* JWT-Authentifizierung für Socket.io
* Ratenbegrenzung über `rate-limiter-flexible`
* Strukturierte Logs mit `pino`
* Prometheus-Metriken unter `/metrics`
* Beispielhafter Echo-Channel

## Konfigurationsvariablen

Das mitgelieferte `ghostshell.conf` verwendet Platzhalter, die zur Laufzeit 
mit Umgebungsvariablen ersetzt werden können.

| Variable   | Beschreibung                                             | Standard |
|-----------|-----------------------------------------------------------|----------|
| `PORT_BASE` | Port des ersten Node.js-Workers im Upstream              | `3000`   |
| `PORT_NEXT` | Port des zweiten Node.js-Workers im Upstream             | `3001`   |
| `WORKER_COUNT` | Anzahl der Worker-Prozesse bei automatischer Generierung | CPUs |
| `PORT_RANGE` | Portbereich aller Worker, z. B. `3000-3007`              | - |

Die Nginx-Konfiguration kann mit `pnpm generate:ghostshell-nginx` aus diesen
Variablen erzeugt werden. Dabei wird für jeden Worker-Port ein Eintrag im
Upstream-Block generiert.

