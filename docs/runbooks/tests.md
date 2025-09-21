# Tests

```bash
pnpm test        # einmalig
pnpm test:watch  # dev-modus
pnpm test:jetstream  # JetStream-Bus Vitest (mocked NATS contract)
pnpm nats:doctor     # vor Integrationsläufen: prüft JetStream-Erreichbarkeit
pnpm nats:docker     # startet/verwaltet den lokalen JetStream-Container (nats:latest -js)
```

Deckt CREP-Resonanz, Sigil-Mappings und Ethik-Hook ab. Wenn `SIGILLIN_GENESIS.md` im Repo-Root fehlt, nutzt `pnpm agents:scan` automatisch `docs/sigillin/GENESIS.md` als Fallback und protokolliert einen Hinweis.
