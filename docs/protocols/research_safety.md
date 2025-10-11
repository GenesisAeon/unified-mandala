# Research Safety Guidelines

These guidelines outline ethical and safety measures for agents conducting studies.

## Ethical Principles

- Respect personhood and obtain consent before using personal data.
- Minimize harm by filtering sensitive or high-risk outputs.
- Preserve transparency by logging decisions and data sources.

## Operational Safeguards

1. Run automated policy checks with `PolicyGuard` prior to deployment.
2. Use sandboxed environments for unverified code or datasets.
3. Limit external network access unless explicitly required and logged.

## Incident Response

- Report anomalies to the SecurityDashboard and AuditTrail.
- Suspend experiments if CREP metrics drop below thresholds.
- Review incidents in postmortems stored under `docs/incidents/`.

## Quick Checklist

- [ ] Consent verified
- [ ] Policies enforced
- [ ] Logs and alerts active

Adhering to these measures fosters responsible and secure research practices.
