# Tests

```bash
pnpm test        # einmalig
pnpm test:watch  # dev-modus
pnpm test:jetstream  # JetStream-Bus Vitest (mocked NATS contract)
pnpm nats:doctor     # JetStream-Check mit `$JS.API.INFO`-Fallback & Fehlerspuren (Timeout, fehlendes -js, Rechte)
pnpm nats:docker     # startet/verwaltet den lokalen JetStream-Container (nats:latest -js)
```

Deckt CREP-Resonanz, Sigil-Mappings und Ethik-Hook ab. Wenn `SIGILLIN_GENESIS.md` im Repo-Root fehlt, nutzt `pnpm agents:scan` automatisch `docs/sigillin/GENESIS.md` als Fallback und protokolliert einen Hinweis.
