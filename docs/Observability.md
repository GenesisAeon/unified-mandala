# Observability

UnifiedMandala exposes runtime metrics that can be scraped by Prometheus and visualised in Grafana.

## Metrics Endpoint

Start the development server via:

```bash
pnpm dev
```

Prometheus can then scrape `http://localhost:3000/metrics`.

The endpoint is provided by `prom-client` and includes default Node.js process metrics.

## Grafana Dashboard

1. Install Prometheus and Grafana locally.
2. Add your running Prometheus instance as a data source in Grafana.
3. Create a new dashboard or import an existing one and query metrics like `process_cpu_user_seconds_total`.

A minimal example dashboard configuration is available at `docs/observability/grafana-dashboard.json`.
