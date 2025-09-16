# Observability Setup

This folder contains resources for monitoring the MandalaHaiku ecosystem.

## Prometheus Metrics

The `ghost-shell` server exposes a `/metrics` endpoint collecting default Node.js metrics. The `mandalaHaiku` plugin now registers its own counter `mandala_haiku_generated_total` whenever a new Haiku is produced.

Point Prometheus to `<server>/metrics` to scrape these values.

## Grafana Dashboard

Import the JSON in `grafana/mandala-haiku-dashboard.json` into Grafana to visualize the Haiku generation rate and basic process metrics.

## Docker Compose Profile

Start Prometheus and Grafana locally via the dedicated profile:

```bash
docker compose --profile monitoring up -d
```

Prometheus will be available on <http://localhost:9090>, Grafana on <http://localhost:3100>. Default credentials are `admin` / `admin` (configure secrets before production use).
