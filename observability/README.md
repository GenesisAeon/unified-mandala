# Observability Setup

This folder contains resources for monitoring the MandalaHaiku ecosystem.

## Prometheus Metrics

The `ghost-shell` server exposes a `/metrics` endpoint collecting default Node.js metrics. The `mandalaHaiku` plugin now registers its own counter `mandala_haiku_generated_total` whenever a new Haiku is produced.

Point Prometheus to `<server>/metrics` to scrape these values.

## Grafana Dashboard

Import the JSON in `grafana/mandala-haiku-dashboard.json` into Grafana to visualize the Haiku generation rate and basic process metrics.

## Docker Compose Profile

Launch Prometheus and Grafana locally with the new `monitoring` profile:

```bash
docker compose --profile monitoring up
```

- Prometheus UI → <http://localhost:9090>
- Grafana UI → <http://localhost:3300> (default credentials `admin`/`admin`)

Configuration files live under `observability/prometheus.yml` and `observability/grafana/`.

## Automated Smoke Check

Use the dist-first script to confirm the stack is reachable once the containers are running:

```bash
pnpm observability:check
```

The check queries Prometheus `/api/v1/targets` (failing if no healthy targets are reported unless `PROMETHEUS_REQUIRE_ACTIVE=0`) and Grafana `/api/health` on port 3300. Set `OBSERVABILITY_SKIP_GRAFANA=1` to skip Grafana during ad-hoc investigations.
