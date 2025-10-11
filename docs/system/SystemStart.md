# System Start

This guide outlines how to launch Mandala agents and their model
providers using `ts-node`.

## Prerequisites

- Dependencies installed via `pnpm install`.
- Agent definitions present in `agents.yaml`.

## Starting the system

Run the system start script with:

```bash
pnpm ts-node scripts/system-start.ts
```

Use `--dry-run` to print the planned lifecycle without activating the
agents:

```bash
pnpm ts-node scripts/system-start.ts --dry-run
```

The script loads all agents, boots available model providers and emits
lifecycle events through the local event bus.
