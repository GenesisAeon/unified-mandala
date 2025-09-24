# START HERE · Unified Mandala

This quickstart gets a workstation online, validates the golden path, and explains the CODE ↔ RUNTIME split.

## 1. Bootstrap the environment

```bash
./scripts/setup-dev-env.sh
```

On Windows PowerShell 7+:

```powershell
pwsh -NoProfile -File ./scripts/setup-dev-env.ps1
```

Bring up the local NATS JetStream used by the AI bridge:

```bash
docker start nats || docker rm -f nats && docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest
curl http://localhost:8222/varz
```

## 2. Walk the golden path

```bash
pnpm --filter @unified-mandala/ai build
pnpm --filter @unified-mandala/api build
pnpm start:light
```

1. Open the Mandala AI Playground (apps/ui) and send a prompt.
2. Confirm the path `Prompt → Responses API → NATS → /api/ai/chat → UI` responds without errors.
3. Stop the light server with `Ctrl+C` when done.

## 3. Two-plane guardrails

- `repo://` — Read-only source tree. Commits must never write runtime artefacts here.
- `scratch://` & `data://` — Runtime storage for agents and generated output. The guarded FS routes writes here automatically.

## 4. Provenance labels

Every pull request must carry exactly one label:

| Label                | Scope                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `source:human`       | Human-authored code anywhere in the repo (no `scratch/` or `data/` commits)                                   |
| `source:human-docs`  | Docs-only updates (`docs/`, `analysis/`, `out/`, `.github/`, README/CHANGELOG, MandalaMap*, command-catalog*) |
| `source:mandala-ai`  | Mandala automation touching `packages/ai`, `apps/*ai`, runtime stores, docs, or CI metadata                   |
| `source:external-ai` | External AI contributions limited to docs, analysis, scratch/data mirrors, or `.github/` configs              |

CI enforces the mapping via `auto-provenance`, `provenance-gate`, and the status gate on `ready-to-merge`.

## 5. Troubleshooting

- `docker ps -a --filter name=nats` — Check the local JetStream container status.
- `docker logs --tail=50 nats` — Inspect connection errors.
- `pnpm nats:doctor` — Validate CLI connectivity (used by runtime CI lane).
- `pnpm run sanity` — Aggregate repository health checks when debugging CI failures.
