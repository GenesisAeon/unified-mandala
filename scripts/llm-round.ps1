param(
  [string]$ClaudePrompt = "tools/llm-review-prompts/claude.md",
  [string]$MistralPrompt = "tools/llm-review-prompts/mistral.md"
)
if (-not (Test-Path feedback)) { New-Item -ItemType Directory feedback | Out-Null }

node tools/llm/send-claude.mjs $ClaudePrompt feedback/claude.md
node tools/llm/send-mistral.mjs $MistralPrompt feedback/mistral.md

node tools/feedback/ingest.mjs feedback/claude.md feedback/mistral.md | Out-File -Encoding utf8 feedback/aggregated.json
node tools/feedback/plan.mjs feedback/aggregated.json
node tools/feedback/apply2.mjs CHANGESET.yaml

node tools/bus-smoke.ts
node tools/governance-check.mjs
node tools/release/notes2.mjs

Write-Host "✅ LLM round-trip complete."
