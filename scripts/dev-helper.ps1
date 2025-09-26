# Unified Mandala Dev Helper (PowerShell)
# Cmdlets to manage local secrets, services, ports, and quick tests.
# Usage:
#   . ./scripts/dev-helper.ps1
#   Start-UM
#   Stop-UM
#   Test-UM
#   Start-UI -Port 5174

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-UMInfo {
  param([string]$Message)
  Write-Host "[UM] $Message" -ForegroundColor Cyan
}

function Set-UMSecrets {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory = $false)] [string]$ApiKey,
    [Parameter(Mandatory = $false)] [string]$Model = 'gpt-4o-mini',
    [Parameter(Mandatory = $false)] [string]$ApiEnvPath = 'apps/api/.env.local'
  )

  if (-not $ApiKey -and $env:OPENAI_API_KEY) { $ApiKey = $env:OPENAI_API_KEY }
  if (-not $ApiKey) {
    Write-UMInfo 'OPENAI_API_KEY not provided; set it with -ApiKey or in your User env.'
  }

  if ($ApiKey) {
    [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $ApiKey, 'User') | Out-Null
    Write-UMInfo 'Stored OPENAI_API_KEY in User environment.'
  }
  [Environment]::SetEnvironmentVariable('OPENAI_MODEL', $Model, 'User') | Out-Null
  Write-UMInfo "Stored OPENAI_MODEL='$Model' in User environment."

  $resolvedKey = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User')
  $resolvedModel = [Environment]::GetEnvironmentVariable('OPENAI_MODEL','User')

  $content = @()
  if ($resolvedKey)   { $content += "OPENAI_API_KEY=$resolvedKey" }
  if ($resolvedModel) { $content += "OPENAI_MODEL=$resolvedModel" }
  $content += 'PORT=4000'

  $apiEnvDir = Split-Path -Parent $ApiEnvPath
  if (-not (Test-Path $apiEnvDir)) { New-Item -ItemType Directory -Path $apiEnvDir | Out-Null }
  Set-Content -Path $ApiEnvPath -Value ($content -join "`n") -NoNewline
  Write-UMInfo "Wrote $ApiEnvPath (gitignored by default)."
}

function Start-NATS {
  [CmdletBinding()]
  param()
  Write-UMInfo 'Ensuring NATS server is running on ports 4222/8222 (requires Docker).'
  try {
    docker ps -a --format '{{.Names}}' | Select-String -Quiet '^nats$' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'no-container' }
    docker start nats | Out-Null
  } catch {
    docker rm -f nats 2>$null | Out-Null
    docker run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js | Out-Null
  }
}

function Free-UMPorts {
  [CmdletBinding()]
  param([int[]]$Ports = @(3001,3002,3003,3004,4020,4021))
  Write-UMInfo ("Freeing ports: {0}" -f ($Ports -join ', '))
  $conns = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $Ports -contains $_.LocalPort }
  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    try { Stop-Process -Id $pid -Force -ErrorAction Stop; Write-UMInfo "Killed PID $pid" } catch {}
  }
}

function Start-UI {
  [CmdletBinding()]
  param([int]$Port = 5174)
  Write-UMInfo "Starting UI dev server on port $Port"
  $env:UI_DEV_URL = "http://localhost:$Port"
  pnpm -F mandala-ui dev -- --port $Port
}

function Start-UM {
  [CmdletBinding()]
  param([switch]$NoNATS)
  if (-not $NoNATS) { Start-NATS }
  $env:NATS_URL = 'nats://127.0.0.1:4222'
  Write-UMInfo 'Starting full dev stack (services)'
  pnpm dev:stack
}

function Stop-UM {
  [CmdletBinding()]
  param([int[]]$Ports = @(3001,3002,3003,3004,4020,4021))
  Free-UMPorts -Ports $Ports
}

function Test-UM {
  [CmdletBinding()]
  param([switch]$Extended)
  Write-UMInfo 'Running unit tests and schema/map validation'
  pnpm -w test:unit
  pnpm -w schema:validate
  pnpm maps:validate
  if ($Extended) { pnpm repomap:build; pnpm repomap:validate; pnpm policy:check }
}

function Smoke-UI {
  [CmdletBinding()]
  param([string]$Url = $env:UI_DEV_URL)
  if (-not $Url) { $Url = 'http://localhost:5174' }
  Write-UMInfo "UI smoke at $Url"
  try {
    $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
    Write-UMInfo "UI responded: HTTP $($res.StatusCode)"
  } catch {
    Write-Warning "UI smoke failed: $($_.Exception.Message)"
  }
}

function Health-Check {
  [CmdletBinding()]
  param([string]$ApiUrl = 'http://localhost:4000/health')
  try {
    $r = Invoke-RestMethod -Uri $ApiUrl -TimeoutSec 5
    Write-UMInfo ("Health: {0}" -f ($r | ConvertTo-Json -Compress))
  } catch {
    Write-Warning "Health check failed: $($_.Exception.Message)"
  }
}

function Invoke-UMChat {
  [CmdletBinding()]
  param([string]$ApiUrl = 'http://localhost:4000/api/ai/chat',[string]$Message = 'Hallo Aeon!')
  $body = @{ messages = @(@{ role = 'user'; content = $Message }) } | ConvertTo-Json -Depth 5
  try {
    $res = Invoke-RestMethod -Uri $ApiUrl -Method Post -ContentType 'application/json' -Body $body
    $json = $res | ConvertTo-Json -Depth 6
    Write-Output $json
  } catch {
    Write-Warning "Chat request failed: $($_.Exception.Message)"
  }
}

function Smoke-AI {
  [CmdletBinding()]
  param(
    [string]$ApiUrl = 'http://localhost:4000/api/ai/chat',
    [string]$Message = 'Ping'
  )
  $body = @{ messages = @(@{ role = 'user'; content = $Message }) } | ConvertTo-Json -Depth 5
  try {
    $res = Invoke-RestMethod -Uri $ApiUrl -Method Post -ContentType 'application/json' -Body $body
    $content = $res?.choices?[0]?.message?.content
    if ($content) {
      Write-UMInfo "AI OK: $content"
      return 0
    } else {
      Write-Warning 'AI response shape unexpected'
      return 1
    }
  } catch {
    Write-Warning "AI smoke failed: $($_.Exception.Message)"
    return 2
  }
}

function Start-UMHealth {
  [CmdletBinding()]
  param([int]$Port = 3999)
  Write-UMInfo "Starting health aggregator on $Port"
  $env:UM_HEALTH_PORT = "$Port"
  pnpm dev:health
}

Export-ModuleMember -Function *-UM,Start-UI,Smoke-UI,Health-Check,Invoke-UMChat,Set-UMSecrets,Free-UMPorts,Start-NATS,Smoke-AI,Start-UMHealth
