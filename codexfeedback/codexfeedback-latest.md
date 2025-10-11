# Codexfeedback – Fraktal 92

- Phase: Re-Entry + Qwen Tools
- Status: Proxy/Health ok; UI renders output_text; qwen-smoke stabilized; FS list + Memory endpoints added; memory smoke added
- Next: Optional Vite proxy header for Plan B; expand memory to embeddings (later)

What changed

- apps/api-lite/ollama-proxy.mjs: add /api/tools/fs/list; add /api/tools/memory/{remember,recall}
- scripts/smoke/memory-smoke.mjs: quick memory verify
- sigils/sigillin_qwen_playground.sigil.yaml: baseline sigillin
- package.json: add smoke:memory, quick:test scripts (earlier)

Validate

- pnpm quick:test:a (Plan A) or quick:test:b (Plan B)
- pnpm smoke:memory

Refs

- docs/roadmap/v1.0-stabilization-playbook.md
- MandalaMap.yaml, MandalaMap.json, MandalaMap.md
