# CREP Research Protocol

This runbook guides researchers applying the CREP framework within experiments.

## Preparation

- Define hypothesis and expected CREP impact.
- Register planned datasets and tools in the provenance log.
- Obtain required personhood consents.

## Execution Steps

1. Initialize agents with declared roles and depth.
2. Capture initial CREP metrics via `crep/metrics.ts` utilities.
3. Run experiments, logging events to the AuditTrail.
4. Evaluate CREP changes after each cycle.

## Reporting

- Summarize results with metric deltas and notable events.
- Store reports under `analysis/` with links to raw logs.
- Update `advancedprogress.json` using `update-advanced-progress.js`.

## Completion Checklist

- [ ] Hypothesis and consents recorded
- [ ] Metrics captured before and after
- [ ] Audit logs archived
- [ ] Results published

Adhering to this protocol keeps CREP studies reproducible and ethically grounded.
