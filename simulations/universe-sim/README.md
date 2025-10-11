# Universe Simulation Prototype

This directory contains a simple Go program demonstrating the Explorer and Observer agents described in the project blueprint.

Running `sim-runner.go` will create a state snapshot file and an event log file for a small 5‑round simulation.

```
go run cmd/sim-runner.go
```

Output files will be named `state-<runId>-v1.jsonl` and `events-<runId>.jsonl`.
