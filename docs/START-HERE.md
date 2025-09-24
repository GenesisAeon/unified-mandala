# START HERE · Unified Mandala

## 1. Entwicklungsumgebung

- `./scripts/setup-dev-env.sh` (bash) oder `pwsh -NoProfile -File ./scripts/setup-dev-env.ps1`
- NATS JetStream vorbereiten:
  ```bash
  docker start nats || docker rm -f nats && docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js
  ```
- Healthcheck: `curl http://localhost:8222/varz` (Status 200 ⇒ OK)

## 2. Golden Path (Responses → NATS → API → Playground)

1. `pnpm -F @unified-mandala/ai build`
2. `pnpm -F @unified-mandala/api build`
3. `pnpm start:ai:playground`
4. Prompt an die Playground-UI schicken → Response über NATS → `/api/ai/chat` prüfen

## 3. Two-Plane Modell

- `repo://` → Read-only Codeebene (PRs, Tests, Workflows)
- `scratch://`, `data://` → Runtime-Ausgaben, Zwischenergebnisse, Storage
- `.ai-scratch/` bleibt im Repo ignoriert; Runtime-Dateien werden nicht committed

## 4. Provenance Labels

- **source:human** – menschlicher Code (volle Repo-Rechte)
- **source:human-docs** – ausschließlich Docs/Analysen/Artefakte
- **source:mandala-ai** – Mandala-Automation (AI-Workspace, scratch/data, Docs)
- **source:external-ai** – externe AI; nur `scratch/`, `docs/`, `analysis/`, `out/`, `.github/`

> CI prüft die Label-/Pfadmatrix automatisch (Workflows `auto-provenance` & `provenance-gate`).

## 5. Nützliche Befehle

- `pnpm typecheck`, `pnpm lint:eslint`, `pnpm test:unit:coverage`
- `pnpm sanity`, `pnpm policy:check`, `pnpm maps:validate`
- `pnpm labels:setup` (GitHub Labels für Provenance & CI-Lanes anlegen)

> CI-Core (`ci.core.yml`) führt Typecheck, Lint, Build, Coverage, Schema-/Map-Validierung, Repo-Sanity und Policy-Suite auf jedem
> relevanten PR-Lauf aus; Artefakt `coverage-vitest` steht nach dem Lauf bereit.

Weitere Details: `docs/roadmap/v1.0-stabilization-playbook.md`, `docs/cheatsheets/unified-mandala-workflows.md`.
