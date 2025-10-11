<#
.SYNOPSIS
  Startet den Mandala Playground: Ollama-Proxy (/api/*) + UI-Dev-Server.

.DESCRIPTION
  Öffnet zwei PowerShell-Fenster: Proxy (Port 4000) und UI (Port 5173).
  Optional zieht es das Embedding-Modell und triggert einen RAG-Index über die angegebenen Roots.

.PARAMETER UiPort
  Port des UI-Dev-Servers (Default: 5173).

.PARAMETER ApiPort
  Port des Ollama-Proxys (Default: 4000), UI proxyt /api/* dorthin.

.PARAMETER QwenEndpoint
  Ollama-HTTP Endpoint (Default: http://localhost:11434).

.PARAMETER QwenModel
  Modellname für den Proxy (Default: qwen2.5:7b).

.PARAMETER WithKey
  Nutzt die lokale Vite-Config mit Key-Injection (dev:ui:with-key).

.PARAMETER InitRag
  Zieht Embeddings (ollama pull nomic-embed-text) und triggert einen RAG-Index + Query.

.PARAMETER RagRoots
  Kommagetrennte Roots für den RAG-Index (Default: "repo://docs").

.EXAMPLE
  powershell -File scripts/start-playground.ps1 -WithKey
  # Startet Proxy :4000 + UI :5173 (Key-Config)

.EXAMPLE
  powershell -File scripts/start-playground.ps1 -UiPort 5174 -ApiPort 4001
  # Startet Proxy :4001 + UI :5174 (ohne Key-Config)

.EXAMPLE
  powershell -File scripts/start-playground.ps1 -WithKey -InitRag -RagRoots "repo://docs,repo://apps/ui"
  # Startet Proxy + UI und triggert danach RAG-Index über mehrere Roots

#>

param(
  [int]$UiPort = 5173,
  [int]$ApiPort = 4000,
  [string]$QwenEndpoint = "http://localhost:11434",
  [string]$QwenModel = "qwen2.5:7b",
  [switch]$WithKey,
  [switch]$InitRag,
  [string]$RagRoots = "repo://docs",
  [switch]$WithPrimer,
  [string]$PrimerFile = "sigils/qwen-primer.md"
)

# Root of repo (script is in scripts/)
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "Starting Ollama proxy on port $ApiPort (model=$QwenModel)" -ForegroundColor Cyan
$proxyCmd = @(
  "cd `"$repoRoot`"",
  "$env:QWEN_ENDPOINT='$QwenEndpoint'",
  "$env:QWEN_MODEL='$QwenModel'",
  "$env:PORT='$ApiPort'",
  $(if ($WithPrimer) { "$env:QWEN_PRIMER_FILE='$(Join-Path $repoRoot $PrimerFile)';" } else { "" }),
  "pnpm start:ollama-proxy"
) -join '; '

Start-Process powershell -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-Command', $proxyCmd) | Out-Null

$uiCmd = if ($WithKey) {
  "cd `"$repoRoot`"; pnpm dev:ui:with-key"
} else {
  "cd `"$repoRoot`"; pnpm -F mandala-ui dev -- --port $UiPort"
}

Write-Host "Starting UI on http://localhost:$UiPort (WithKey=$($WithKey.IsPresent))" -ForegroundColor Cyan
Start-Process powershell -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-Command', $uiCmd) | Out-Null

Write-Host "Playground launched: proxy(:$ApiPort) + UI(:$UiPort)" -ForegroundColor Green

if ($InitRag) {
  Write-Host "Initializing RAG: pulling embeddings + indexing $RagRoots" -ForegroundColor Yellow
  try {
    # Pull embedding model (blocking)
    & ollama pull nomic-embed-text
  } catch {
    Write-Warning "ollama pull failed or not installed. Ensure Ollama is available if you need embeddings. $_"
  }
  Start-Sleep -Seconds 2
  # Trigger a small index + query via existing smoke script
  $ragCmd = @(
    "cd `"$repoRoot`"",
    "$env:PROXY_URL='http://127.0.0.1:$ApiPort'",
    "pnpm smoke:rag"
  ) -join '; '
  Start-Process powershell -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-Command', $ragCmd) | Out-Null
  Write-Host "RAG init triggered (see smoke output window)" -ForegroundColor Green
}
