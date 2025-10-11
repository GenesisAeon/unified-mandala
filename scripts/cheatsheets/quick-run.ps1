<#
  scripts/cheatsheets/quick-run.ps1
  Re-Entry Testflow für Unified-Mandala (Windows PowerShell)

  Nutzung:
    - Plan A (ohne API-Key):  .\scripts\cheatsheets\quick-run.ps1 -Mode A
    - Plan B (mit API-Key) :  .\scripts\cheatsheets\quick-run.ps1 -Mode B -ApiKey 'dev-key'
#>

param(
  [ValidateSet('A','B')][string]$Mode = 'A',
  [string]$ApiKey = '',
  [int]$SmokeTimeoutMs = 60000,
  [string]$Repo = 'D:\\mandala\\unified-mandala',
  [int]$UiPort = 5173,
  [int]$ApiPort = 4000
)

$ErrorActionPreference = 'Stop'
Set-Location $Repo

function Start-Proxy {
  param([string]$Mode,[string]$ApiKey,[int]$ApiPort)
  if ($Mode -eq 'A') {
    $cmd = "cd $Repo; Remove-Item Env:LOCAL_API_KEY -ErrorAction SilentlyContinue; pnpm start:ollama-proxy"
  } else {
    $cmd = "cd $Repo; `$env:HOST='127.0.0.1'; `$env:PORT='$ApiPort'; `$env:QWEN_ENDPOINT='http://localhost:11434'; `$env:QWEN_MODEL='qwen2.5:7b'; `$env:LOCAL_API_KEY='$ApiKey'; pnpm start:ollama-proxy"
  }
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command",$cmd | Out-Null
}

function Start-UI {
  param([int]$UiPort)
  $cmd = "cd $Repo; pnpm -F mandala-ui dev -- --port $UiPort"
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command",$cmd | Out-Null
}

function Wait-Health {
  param([string]$Base)
  if (-not $Base) { $Base = "http://127.0.0.1:$ApiPort" }
  $t0 = Get-Date
  $deadline = $t0.AddSeconds(30)
  while ((Get-Date) -lt $deadline) {
    try {
      $r = Invoke-RestMethod "$Base/health" -TimeoutSec 3
      if ($r.ok) { Write-Host " Health OK ($Base)"; return }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  throw "Proxy wurde nicht gesund innerhalb von 30 s."
}

function Smoke-Qwen {
  param([int]$TimeoutMs,[string]$ApiKey)
  Write-Host " Smoke Qwen"
  $env:SMOKE_TIMEOUT_MS = "$TimeoutMs"
  if ($ApiKey) { $env:LOCAL_API_KEY = $ApiKey } else { Remove-Item Env:LOCAL_API_KEY -ErrorAction SilentlyContinue }
  node scripts/smoke/qwen-smoke.mjs
}

function Smoke-FS {
  param([string]$Proxy,[string]$ApiKey)
  Write-Host " Smoke FS"
  if (-not $Proxy) { $Proxy = "http://127.0.0.1:$ApiPort" }
  $env:PROXY_URL = $Proxy
  if ($ApiKey) { $env:LOCAL_API_KEY = $ApiKey } else { Remove-Item Env:LOCAL_API_KEY -ErrorAction SilentlyContinue }
  node scripts/smoke/fs-smoke.mjs
}

function Manual-Probes {
  param([string]$Proxy,[string]$ApiKey)
  if (-not $Proxy) { $Proxy = "http://127.0.0.1:$ApiPort" }
  Write-Host " Manuelle Probes"
  $body = @{ messages = @(@{ role = 'user'; content = 'Sag etwas Schönes. 1 kurzer Satz.' }) } | ConvertTo-Json -Depth 5
  $headers = @{}
  if ($ApiKey) { $headers['X-API-Key'] = $ApiKey }
  Invoke-RestMethod "$Proxy/api/chat"    -Method POST -ContentType "application/json" -Body $body -Headers $headers | Out-Host
  Invoke-RestMethod "$Proxy/api/ai/chat" -Method POST -ContentType "application/json" -Body $body -Headers $headers | Out-Host
}

Write-Host (" Re-Entry: Plan {0}" -f $Mode) -ForegroundColor Cyan
try { . "$Repo\\scripts\\dev-helper.ps1"; Stop-UM | Out-Null } catch { }

Start-Proxy -Mode $Mode -ApiKey $ApiKey -ApiPort $ApiPort
Start-UI -UiPort $UiPort

Write-Host "warte auf Proxy-Health" -ForegroundColor DarkGray
Wait-Health -Base ("http://127.0.0.1:{0}" -f $ApiPort)

if ($Mode -eq 'B' -and -not $ApiKey) { Write-Warning "Plan B gewählt, aber kein -ApiKey übergeben." }

# Effektiven API-Key explizit setzen (kein ternary in PS 5.1)
$effectiveApiKey = ''
if ($Mode -eq 'B') { $effectiveApiKey = $ApiKey }

Smoke-Qwen -TimeoutMs $SmokeTimeoutMs -ApiKey $effectiveApiKey
Smoke-FS   -Proxy ("http://127.0.0.1:{0}" -f $ApiPort) -ApiKey $effectiveApiKey
Manual-Probes -Proxy ("http://127.0.0.1:{0}" -f $ApiPort) -ApiKey $effectiveApiKey

Write-Host (" Re-Entry-Run fertig. UI: http://localhost:{0}/demo/ai-playground" -f $UiPort) -ForegroundColor Green

