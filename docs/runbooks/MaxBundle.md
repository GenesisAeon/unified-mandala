# MaxBundle Runbook

This runbook captures the minimal steps for operating the **MaxBundle** deployment. It focuses on four core aspects: JetStream messaging, security, observability and scaling.

## JetStream setup
- Run `node scripts/js-setup.ts` to ensure required streams exist.
- Bridge local events with NATS using `scripts/start-bus-bridge.ts` when needed.

## Security
- Sign event envelopes via `packages/security/HmacSigner.ts`.
- Enforce permissions with `packages/governance/PolicyEnforcer.ts` once available.

## Observability
- Start the metrics server: `node scripts/metrics-start.ts` (exposes `/metrics`).
- Configure Prometheus or other tooling to scrape metrics on port `9108`.

## Scaling
- Use `deployment/keda/scaledobject-natsjs.yaml` as a template for KEDA based auto-scaling.
- Review resource limits and horizontal scaling rules before deploying to production.

Keep this document close during operations and expand it as additional components join the bundle.
