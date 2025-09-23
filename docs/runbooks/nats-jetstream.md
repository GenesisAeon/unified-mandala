# NATS + JetStream Runbook

JetStream stellt den Event-Bus für UI-Smokes, Agentenläufe und Integrations-Tests bereit. Dieses Runbook bündelt Start-, Diagnose- und Troubleshooting-Schritte für lokale Setups und CI.

## Start (Docker)

```powershell
# vorhandenen Container entfernen
docker rm -f nats 2>$null
# Standard-Setup mit JetStream aktivieren
docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js
```

```bash
# Alternative (Linux/macOS)
docker rm -f nats 2>/dev/null

# JetStream starten
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run --name nats \
  -p 4222:4222 -p 8222:8222 -d nats:latest -js
```

> ℹ️ `pnpm nats:docker` kapselt diese Schritte. Das Skript startet, stoppt oder prüft den Containerstatus (siehe `package.json`).

## Status & Laufzeit prüfen

```bash
docker ps -a --filter name=^/nats$ --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
# Container erneut starten, falls `Status` "Exited" zeigt
docker start nats
# Logauszug für Diagnose
docker logs --tail=50 nats
```

```powershell
# Windows-Portcheck (PowerShell)
Test-NetConnection 127.0.0.1 -Port 4222
```

`scripts/setup-dev-env.ps1` erkennt laufende Docker-Container automatisch. Ein `Exited`-Status löst weiterhin einen Hinweis aus,
damit `docker start nats` bzw. `docker rm -f nats` + Neuaufbau angestossen werden können.

## Diagnose & Readiness

```bash
# Softcheck über JetStream-Manager + Fallback auf $JS.API.INFO
pnpm nats:doctor

# Integrationstest mit Vitest (nutzt Mocked Contracts)
pnpm test:jetstream
```

`pnpm nats:doctor` liefert bei Fehlschlägen konkrete Hinweise (z. B. JetStream fehlt, Timeout, fehlende Berechtigung) und nutzt `$JS.API.INFO` als Fallback für ältere/limitierte Deployments.

### Direkte API-Abfrage

```bash
# benötigt lokalen NATS-Container oder laufenden Server auf 4222
docker run --rm --network host natsio/nats-box:latest \
  nats req '$JS.API.INFO' ''
```

### Typische Fehlerbilder

| Symptom                                                     | Ursache                                         | Abhilfe                                                                                       |
| ----------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `ECONNREFUSED` in `nats:doctor`                             | Container läuft nicht oder Port 4222 ist belegt | `pnpm nats:docker restart` oder `pnpm dlx kill-port 4222` ausführen.                          |
| `no responders available for request`                       | JetStream nicht aktiviert (`-js` fehlt)         | Container neu starten mit `-js` Flag oder lokale Installation mit `nats-server -js`.          |
| `Connected server ... does not advertise JetStream support` | Server meldet kein JetStream in `INFO`          | NATS mit JetStream starten (`nats-server -js`, Docker-Flag `-js`) oder Konfiguration prüfen.  |
| Timeout nach mehreren Attempts                              | Corporate Proxy/Firewall blockt Verbindung      | `NATS_URL=nats://127.0.0.1:4222 pnpm nats:doctor` setzen, ggf. Proxy-Ausnahmen konfigurieren. |
| `authorization violation` / `permission denied`             | Account hat keine JetStream-Rechte              | JetStream-User/Token prüfen und Zugriff auf `$JS.API.INFO` bzw. Streams freischalten.         |

## Windows-spezifische Hinweise

- PowerShell Quickstart siehe README („Quickstart (Windows · PowerShell)“).
- `pnpm dev:stack` bereinigt belegte Standard-Ports automatisch via `kill-port`. Bei Bedarf manuell `pnpm dev:ports:free` bzw. `pnpm dlx kill-port ...` ausführen oder Auto-Cleanup mit `UM_DEV_SERVICES_AUTOFREE_PORTS=0` deaktivieren.
- `winget install --id Synadia.NATS-Server -e` installiert einen lokalen Dienst; beim Start immer `-js` ergänzen.

## CI-Integration

- **CI Core:** `.github/workflows/ci.core.yml` startet einen Docker-basierten NATS-Server (`nats:latest -js`), führt `pnpm nats:doctor` aus und validiert anschließend mit `pnpm test:jetstream`.
- **Nightly:** Spiegeln denselben Ablauf; bei Fehlversuchen Issue-Hook über codexfeedback.

## Cleanup

```bash
docker rm -f nats
```

Weitere Kontextinformationen: `docs/roadmap/v1.0-stabilization-playbook.md` (Fraktal40–57 Status) und MandalaMap.\* dokumentieren JetStream-/NATS-Hooks im Repository.
