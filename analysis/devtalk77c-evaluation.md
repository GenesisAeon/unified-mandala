# DevTalk77c Technical Evaluation

## Scope

- Source conversation: `[Fraktal77]` thread (Johann ↔ Aeon) diagnosing the `/api/ai/chat` 404 during the Mandala UI playground smoke.
- Focus: align DevTalk checklist with the new AI Responses Bridge so that the UI proxy, dev stack services and documentation point to the same runtime endpoint.
- References consulted: `DevTalk.txt` (CI/CD + AI sections), MandalaMap.\*, stabilization playbook, codexfeedback trackers, `scripts/dev-services.mjs` and `apps/ui/vite.config.ts`.

## Findings & Actions

### Dev Stack Alignment

- Added the AI API workspace (`apps/api/src/index.ts`) to `scripts/dev-services.mjs` so `pnpm dev:stack` boots the service on port 4000 alongside Experiments/Share/RAG/Realtime.
- Updated `apps/ui/vite.config.ts` to honour `MANDALA_AI_API_ORIGIN` (default `http://localhost:4000`) ensuring `/api/ai/chat` hits the new service without rewrites.
- `MandalaAIPlayground` copy now references the dedicated AI API instead of the legacy experiments server.

### Documentation & Maps

- MandalaMap (JSON/MD/YAML) bumped to Fraktal81 with the corrected proxy target and metadata timestamp.
- Stabilization playbook (MD/YAML) records that the dev stack launches `apps/api` on port 4000 and that the Vite proxy follows this origin.
- Codexfeedback trackers and the new `codexfeedback-fraktal81.yaml` capture the run; `codexfeedback.md/json/yaml` reference the updated flow.

## Open Items / Follow-ups

- Optional: extend UI smoke/Cypress coverage to exercise `/api/ai/chat` after booting the stack.
- Evaluate whether the Experiments API should proxy to the same AI bridge or retire duplicated endpoints in a future fragment.
