# DevTalk87 Stabilization Evaluation

## Scope

- Conversation source: `DevTalk.txt` blueprint for v1.0 stabilization and Gemini sigillin briefing (Fraktal87 context).
- Objective: validate which roadmap items are already satisfied, surface remaining gaps, and hook them into the fractal tracker.
- Inputs: latest stabilization playbook, MandalaMap, codexfeedback history, Fraktal84-86 deliverables (ports, health, shortcuts).

## Status Review vs. DevTalk Checklist

| Stream        | DevTalk ask                                                                 | Current state                                                                                                       | Notes                                                              |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| CI/CD         | Core + nightly pipelines with lint/test/policy gates and coverage artefacts | ✅ Implemented via `ci.core.yml` + `ci.nightly.yml`; `pnpm check:ci`/`ci:verify` aggregated since Fraktal74-78      | Continue publishing artefacts (`coverage-vitest`, policy bundles). |
| Code quality  | Dist-first runners, husky hooks, dependency hygiene                         | ✅ Dist-first + husky documented; PowerShell dev-helper + guard-no-dotenv live                                      | Remaining automation: shortcut diagnostics CLI still pending.      |
| Observability | Compose profile with Prometheus/Grafana, automated smoke (`curl` targets)   | ✅ `pnpm observability:check` + monitoring profile shipping since Fraktal72/79                                      | Future: expose health aggregator in docs/UI badge.                 |
| AI governance | Policy suite (OPA/Guardrails/Kyverno), AI primer, provenance labeling       | ✅ Policy bundle enforced in `ci.core`; primer in `docs/CommunityOnboarding.md`; provenance gate active (Fraktal77) | Evaluate continuous reporting (GitHub check summary) as follow-up. |
| Documentation | Quickstart + setup scripts + governance primer                              | ✅ README/ONBOARDING + setup scripts (bash/pwsh) shipped; badges present                                            | Need doc delta for port-offset override guidance (Fraktal86 hook). |
| Testing       | Smoke tests + staging drill                                                 | ✅ `pnpm smoke:ui`, `pnpm smoke:live`, `pnpm dev:health` aggregated; contract test guarding `/api/ai/chat`          | Add shortcut diag coverage + optional UI badge test.               |
| Roadmap       | Fraktal tracker + MandalaMap alignment                                      | ✅ MandalaMap/Playbook updated through Fraktal86                                                                    | Refresh with this evaluation and outstanding hooks.                |

## Outstanding Gaps

1. **Shortcut Diagnostics CLI** – Planned in Fraktal85 hook; create `pnpm diag:shortcuts` (or equivalent) to list/rescue PowerShell helper states and update `docs/DEV-SHORTCUTS.md` with troubleshooting table.
2. **Port Offset Documentation** – Extend dev setup docs (`docs/DEV-SHORTCUTS.md`, README quickstart) with the new offset-aware ports from Fraktal86 so Windows/Linux instructions stay aligned.
3. **Health Aggregator Visibility** – Add UI surface/badge (README or docs) referencing `http://localhost:3999/health` (respect offsets) and consider Prometheus scrape example.
4. **Gemini Sigillin Follow-up** – DevTalk introduced Gemini briefing assets; confirm they are versioned in sigils/ and link them in MandalaMap once stabilized.

## Recommendations

- Track the three operational tasks above as the next Fraktal (port-doc, shortcut CLI, health badge). Mark Fraktal87 as **in progress** until those deliverables land.
- Keep CI/policy automation running; review adding summary comments for provenance/policy runs to close the governance feedback loop.
- Revisit DevTalk once Gemini bridge lands to ensure CREP/trikāya guidance remains accurate.
- Nutze `docs/roadmap/RoleOutCommands.*` + `pnpm smoke:qwen`/`pnpm hook:qwen-smoke`, um den Qwen-Rollout sichtbar zu halten; der Self-Hosted-Workflow `ci.qwen-smoke.yml` ergänzt bei Bedarf ein Label-Gate (`ci:qwen-smoke`).

## Update 2025-11-29 – Shortcut Diagnostics umgesetzt

- `scripts/diag/shortcuts.mjs` stellt `pnpm diag:shortcuts` bereit (Dev-Stack-Diagnose, Live-Smoke-JSON, PowerShell-Check) und ergänzt damit den geforderten Shortcut-Sanity-Lauf.
- `scripts/smoke/live-smoke.mjs` akzeptiert jetzt `--json/--soft`, damit Diagnosen nicht an fehlenden Services scheitern und strukturierte Ausgaben liefern.
- `docs/DEV-SHORTCUTS.md` dokumentiert Port-Offsets (inkl. Health-Aggregator-Link), den neuen Diagnosebefehl sowie eine Troubleshooting-Tabelle.
- `docs/roadmap/RoleOutCommands.(md|json|yaml)` markieren `pnpm diag:shortcuts` als Phase-1-Kommando und setzen `pnpm smoke:qwen` auf **ready**.
- Offene Punkte: Climate-MVP-Pipeline (Phase 4) & Gemini-Sigillin-Verlinkung in MandalaMap bleiben auf der To-do-Liste.

## Update 2025-11-30 – Qwen Proxy & Shortcuts harmonisiert

- `apps/api-lite/ollama-proxy.mjs` ermöglicht einen dedizierten Ollama-Proxy (`pnpm start:ollama-proxy`, PowerShell `Start-OllamaProxy`/`Start-UMOllama`) mit nativem `fetch`.
- `apps/ui/vite.config.ts` leitet `/api/*` im Dev-Modus zuverlässig nach Port 4000 weiter, wodurch `pnpm smoke:qwen` den Vite-Proxy nutzen kann.
- `scripts/smoke/qwen-smoke.mjs` setzt auf native `AbortController`, akzeptiert `output_text`-Fallbacks und erkennt `API_BASE`/`QWEN_MODEL` Overrides.
- `scripts/dev-helper.ps1` erweitert die PowerShell-Shortcuts um `Smoke-Qwen` und Start-Cmdlets für Proxy & UI; `package.json` ergänzt `start:ollama-proxy`, `ps:start-ollama-proxy`, `ps:umo`, `ps:smoke-qwen`.
- Stabilization-Playbook (MD/YAML), MandalaMap.(md|json|yaml) und codexfeedback.\* dokumentieren den Fortschritt; Fraktal87 verbleibt bis Climate-MVP & Health-Badge umgesetzt sind auf **in-progress**.
