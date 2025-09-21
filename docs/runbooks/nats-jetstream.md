# NATS + JetStream Dev Runbook

_Updated:_ 2025-10-20

Dieses Runbook bündelt die Arbeitsschritte aus DevTalk Fraktal56/Aeon-Empfehlungen, damit lokale Mandala-Stacks zuverlässig gegen einen JetStream-fähigen NATS-Server laufen.

## 1. Server starten

```bash
# Persistenter Container mit JetStream + Storage Volume
docker run --name nats --restart unless-stopped \
  -p 4222:4222 -p 8222:8222 \
  -v nats-js:/data \
  -d nats:latest -js -sd /data
```

> **Hinweise**
>
> - Windows Desktop: Falls `--network host` nicht greift, verwende `-s nats://host.docker.internal:4222` bei allen `nats` CLI-Aufrufen.
> - Monitoring-UI: http://localhost:8222/ → `JetStream is ENABLED` muss sichtbar sein.
> - Streams/Buckets werden im Volume `nats-js` persistiert.

## 2. Health-Check (`pnpm nats:doctor`)

```bash
pnpm nats:doctor
```

Der Check prüft:

1. TCP-Verbindung (`NATS_URL`, default `nats://127.0.0.1:4222`).
2. JetStream-API (`/JS.API.INFO`).
3. Standard-Stream (`NATS_STREAM`, default `MANDALA`).
4. Feature-Flag-Bucket (`NATS_FEATURE_FLAGS_BUCKET`, default `featureflags`).

Bei Fehlern werden Setup-Hints und ein Verweis auf dieses Runbook ausgegeben. Nutze `NATS_URL`, `NATS_STREAM` und `NATS_FEATURE_FLAGS_BUCKET`, um gegen alternative Server/Buckets zu prüfen.

## 3. JetStream manuell prüfen

### Request/Reply (nats-box)

```bash
# Terminal A – Replier
docker run --rm -it --network host natsio/nats-box:latest \
  nats --server nats://127.0.0.1:4222 reply test.ping "pong"

# Terminal B – Request
docker run --rm -it --network host natsio/nats-box:latest \
  nats --server nats://127.0.0.1:4222 req test.ping "hello"
```

`No responders available` bedeutet: kein Subscriber aktiv → JetStream ist dennoch funktionsfähig.

### Streams & Buckets inspizieren

```bash
# Account-Info (zeigt JetStream Limits & Usage)
docker run --rm -it --network host natsio/nats-box:latest \
  nats --server nats://127.0.0.1:4222 account info

# Standard-Stream sicherstellen (MANDALA)
pnpm exec tsx scripts/js-setup.ts

# Feature-Flag-Bucket via CLI anlegen (falls nötig)
docker run --rm -it --network host natsio/nats-box:latest \
  nats --server nats://127.0.0.1:4222 kv add featureflags
```

Mit `docker run --rm -it --network host natsio/nats-box:latest nats sub '>'` lässt sich sämtlicher Traffic beobachten (u. a. `$JS.API.*`).

## 4. Dev-Stacks koppeln

```powershell
$env:NATS_URL="nats://127.0.0.1:4222"
$env:SHARE_API_PORT=3001
$env:EXPERIMENTS_API_PORT=3002
$env:RAG_API_PORT=3003
pnpm start:all
```

`scripts/dev-services.mjs` startet Flags-, Experiments-, Share-API sowie den Realtime-Hub. Dank der JetStream-Wächter in `packages/event-bus/*` brechen Services mit verständlicher Fehlermeldung ab, wenn JetStream fehlt.

## 5. Troubleshooting

| Symptom                                           | Bedeutung                      | Lösung                                                                     |
| ------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `NatsError: TIMEOUT` während `jetstreamManager()` | JetStream deaktiviert          | Container mit `-js` starten, `pnpm nats:doctor` erneut ausführen.          |
| `No responders available`                         | Kein Subscriber aktiv          | Mit `nats reply …` testen oder Anwendung starten.                          |
| `Stream MANDALA not found`                        | Standard-Stream fehlt          | `pnpm exec tsx scripts/js-setup.ts` ausführen.                             |
| `Key-value bucket featureflags missing`           | Feature-Flag KV nicht angelegt | `nats … kv add featureflags` oder Bucketerstellung per NATS CLI nachholen. |

## 6. Referenzen

- `scripts/nats-dev-check.mjs` – JetStream Ready-Check (`pnpm nats:doctor`).
- `scripts/js-setup.ts` – Erstellt/prüft den Standard-Stream.
- `packages/event-bus/jetstream-utils.ts` – Gemeinsame JetStream-Verfügbarkeitsprüfung.
- README / Community Onboarding / Onboarding – aktualisierte JetStream-Hinweise.
