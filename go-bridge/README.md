# Go-Bridge

Das Go-Bridge-Modul stellt ein polyglottes Interface zu UnifiedMandala bereit.
Es umfasst REST- und gRPC-Clients sowie einen NATS-EventBus-Consumer und ein
Kommandozeilentool. Die Bibliothek kann als SDK in eigenen Projekten verwendet
werden.

## Installation

```bash
go install github.com/GenesisAeon/unifiedmandala-go/cmd/mandala-cli@latest
```

Setze die Umgebungsvariablen oder nutze Flags:

- `MANDALA_API_URL` – Basis-URL der REST-API
- `MANDALA_JWT` – optionales JWT für Authentifizierung
- `NATS_URL` – Adresse des NATS-Servers

## Beispiele

MetaScores abfragen:

```bash
mandala-cli --api https://api.mandala.local meta-scores get
```

Events per NATS abonnieren:

```bash
export NATS_URL=nats://localhost:4222
mandala-cli crep watch
```

Weitere Details finden sich im Quellcode und im
[OpenAPI/Protobuf-Setup](scripts/gen-api.sh).
