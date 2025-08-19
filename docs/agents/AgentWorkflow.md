# Agent Workflow

The agent workflow describes how Mandala agents are loaded and
supervised during system start.

## Lifecycle events

1. **init** – the configuration from `agents.yaml` is parsed.
2. **start** – `AgentWorkflowEngine` resolves dependencies and boots the
   agent.
3. **heartbeat** – running agents periodically emit health signals to
   the event bus.
4. **stop** – agents shut down and finalise their logs.

## System start sequence

1. `scripts/system-start.ts` loads definitions from `agents.yaml`.
2. Each entry is passed to `AgentWorkflowEngine` which emits the
   lifecycle events above.
3. Events are published to the local event bus for monitoring or tests.

Run the sequence with:

```bash
pnpm ts-node scripts/system-start.ts --dry-run
```

The `--dry-run` flag lists the lifecycle events without starting the
agents.

