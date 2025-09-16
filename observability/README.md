# Observability Setup

This folder contains resources for monitoring the MandalaHaiku ecosystem.

## Prometheus Metrics

The `ghost-shell` server exposes a `/metrics` endpoint collecting default Node.js metrics. The `mandalaHaiku` plugin now registers its own counter `mandala_haiku_generated_total` whenever a new Haiku is produced.

Point Prometheus to `<server>/metrics` to scrape these values.

## Grafana Dashboard

Import the JSON in `grafana/mandala-haiku-dashboard.json` into Grafana to visualize the Haiku generation rate and basic process metrics.

## Docker Compose Monitoring Profile

Start the bundled Prometheus/Grafana stack locally via the new Compose profile:

```bash
docker compose --profile monitoring up -d
# Prometheus → http://localhost:9090
# Grafana    → http://localhost:3001 (default admin/admin)
```

The profile mounts `observability/prometheus.yml` and `observability/grafana/` from the repository, so dashboards and scrape targets can be adjusted in-place. Stop the stack with `docker compose --profile monitoring down` when you are done.
