Development quick guide

- Start full stack
  - PowerShell helper: `. ./scripts/dev-helper.ps1; Start-UM`
  - No NATS/Docker: `. ./scripts/dev-helper.ps1; Start-UM -NoNATS` (forces in-memory backends)
  - Opt-in auto-disable if NATS unreachable: `$env:UM_DEV_AUTODISABLE_NATS='1'; pnpm start:all`

- NATS behavior
  - Uses `NATS_URL` if set; defaults to `nats://127.0.0.1:4222`.
  - Memory fallbacks:
    - `flags-api`: `FEATURE_FLAGS_MODE=memory` or `DISABLE_NATS=1`.
    - `experiments-api`: `EXPERIMENTS_STORE=memory` or `DISABLE_NATS=1`.

- Ports
  - Base ports from `config/ports.ts` (ai: 4000, share: 3001, experiments: 3002, rag: 3003, flags: 3004, realtime: 4020/4021, health: 3999).
  - Offset via `PORT_OFFSET`.

- OpenAI setup
  - `. ./scripts/dev-helper.ps1; Set-UMSecrets -ApiKey "<KEY>" -Model "<MODEL_ID>"`
  - Writes `apps/api/.env.local` (gitignored) and stores user env vars.

- Tests
  - Run all: `pnpm test:unit`
  - Typecheck: `npx tsc -p tsconfig.json`, `npx pyright`

- Handy commands
  - Free ports: `pnpm dev:ports:free`
  - Health JSON: `pnpm dev:health` then GET `http://localhost:3999/health`

- Fraktal diary migration
  - Organize: `pnpm meta:fraktal:organize` (moves files, generates index, creates redirect stubs at old paths)
  - Browse index: `docs/fraktal/index.md`

- MandalaMap consistency
  - Validate (non-blocking): `pnpm meta:mandala:validate`
  - Sync JSON/MD from YAML: `pnpm meta:mandala:sync`
