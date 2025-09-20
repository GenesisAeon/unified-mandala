[CmdletBinding()]
param(
  [switch]$SkipPackageInstall,
  [switch]$SkipPythonSetup,
  [switch]$SkipNodeSetup,
  [string]$StateOutput = 'out/setup/install-state.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Get-Variable InstallState -Scope Script -ErrorAction SilentlyContinue)) {
  $script:InstallState = @{}
}

if (-not (Get-Variable InstallMetadata -Scope Script -ErrorAction SilentlyContinue)) {
  $script:InstallMetadata = @{}
}

$script:StateOutput = if ($StateOutput) { $StateOutput } else { $null }

function Write-Step {
  param([string]$Message)
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
  param([string]$Name)
  return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
}

function Update-InstallState {
  param(
    [string]$Key,
    [bool]$Present
  )

  if (-not $Key) {
    return
  }

  $script:InstallState[$Key] = $Present
}

function Resolve-StatePath {
  param([string]$Path)

  if (-not $Path) {
    return $null
  }

  $target = $Path
  if (-not [System.IO.Path]::IsPathRooted($target)) {
    $base = $PSScriptRoot
    if ($base) {
      $repoRoot = Resolve-Path -LiteralPath (Join-Path $base '..') -ErrorAction SilentlyContinue
      if ($repoRoot) {
        $target = Join-Path $repoRoot.Path $target
      } else {
        $target = Join-Path (Get-Location).Path $target
      }
    } else {
      $target = Join-Path (Get-Location).Path $target
    }
  }

  $directory = Split-Path -Path $target -Parent
  if ($directory -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  return $target
}

function Export-InstallReport {
  param([string]$OutputPath)

  if (-not $OutputPath) {
    return
  }

  $resolved = Resolve-StatePath -Path $OutputPath
  if (-not $resolved) {
    return
  }

  $report = [ordered]@{
    timestamp      = (Get-Date).ToString('o')
    shellVersion   = $PSVersionTable.PSVersion.ToString()
    workingDir     = (Get-Location).Path
    packageManager = $script:PackageManager
    options        = [ordered]@{
      skipPackageInstall = [bool]$SkipPackageInstall
      skipPythonSetup    = [bool]$SkipPythonSetup
      skipNodeSetup      = [bool]$SkipNodeSetup
    }
    installState   = $script:InstallState
  }

  if ($script:InstallMetadata.Keys.Count -gt 0) {
    $report['metadata'] = $script:InstallMetadata
  }

  try {
    $json = $report | ConvertTo-Json -Depth 6
    Set-Content -LiteralPath $resolved -Value $json -Encoding UTF8
    Write-Step "Installationsstatus exportiert nach $resolved"
  } catch {
    Write-Warning "Konnte Installationsstatus nicht nach $resolved schreiben: $($_.Exception.Message)"
  }
}

function Get-PackageManager {
  if (Test-CommandExists 'winget') { return 'winget' }
  if (Test-CommandExists 'choco') { return 'choco' }
  if (Test-CommandExists 'scoop') { return 'scoop' }
  return $null
}

function Invoke-PackageInstall {
  param(
    [string]$Manager,
    [string]$FriendlyName,
    [string]$WingetId,
    [string]$ChocoPackage,
    [string]$ScoopPackage
  )

  switch ($Manager) {
    'winget' {
      if ($WingetId) {
        Write-Step "Installing $FriendlyName via winget"
        & winget install --id $WingetId --exact --accept-package-agreements --accept-source-agreements --silent | Out-Null
        return $LASTEXITCODE -eq 0
      }
      return $false
    }
    'choco' {
      if ($ChocoPackage) {
        Write-Step "Installing $FriendlyName via Chocolatey"
        & choco install $ChocoPackage -y | Out-Null
        return $LASTEXITCODE -eq 0
      }
      return $false
    }
    'scoop' {
      if ($ScoopPackage) {
        Write-Step "Installing $FriendlyName via Scoop"
        & scoop install $ScoopPackage | Out-Null
        return $LASTEXITCODE -eq 0
      }
      return $false
    }
    default { return $false }
  }
}

function Ensure-Tool {
  param(
    [string]$Command,
    [string]$FriendlyName,
    [string]$WingetId,
    [string]$ChocoPackage,
    [string]$ScoopPackage,
    [string]$StateKey
  )

  if (Test-CommandExists $Command) {
    Write-Host "✓ $FriendlyName verfügbar ($Command)"
    Update-InstallState -Key $StateKey -Present $true
    return $true
  }

  if (-not $script:PackageManager) {
    Write-Warning "Kein unterstützter Paketmanager gefunden, um $FriendlyName zu installieren. Bitte manuell installieren."
    Update-InstallState -Key $StateKey -Present $false
    return $false
  }

  $installed = [bool](Invoke-PackageInstall -Manager $script:PackageManager -FriendlyName $FriendlyName -WingetId $WingetId -ChocoPackage $ChocoPackage -ScoopPackage $ScoopPackage)
  if ($installed -and (Test-CommandExists $Command)) {
    Write-Host "✓ $FriendlyName erfolgreich installiert"
    Update-InstallState -Key $StateKey -Present $true
    return $true
  }

  Write-Warning "$FriendlyName konnte nicht automatisch installiert werden. Bitte manuell installieren und Skript erneut starten."
  Update-InstallState -Key $StateKey -Present $false
  return $false
}

function Resolve-PythonCommand {
  if (Test-CommandExists 'python') { return 'python' }
  if (Test-CommandExists 'py') { return 'py' }
  return $null
}

Write-Step "Windows Entwicklungsumgebung initialisieren"

$script:PackageManager = Get-PackageManager
$script:InstallMetadata['packageManager'] = $script:PackageManager
if ($SkipPackageInstall) {
  Write-Host "(Paketinstallation übersprungen)"
} elseif (-not $script:PackageManager) {
  Write-Warning "Weder winget, Chocolatey noch Scoop gefunden. Installiere Git, Node.js und Python manuell und führe das Skript erneut aus."
} else {
  Ensure-Tool -Command 'git' -FriendlyName 'Git' -WingetId 'Git.Git' -ChocoPackage 'git' -ScoopPackage 'git' -StateKey 'git'
  Ensure-Tool -Command 'node' -FriendlyName 'Node.js (LTS)' -WingetId 'OpenJS.NodeJS.LTS' -ChocoPackage 'nodejs-lts' -ScoopPackage 'nodejs-lts' -StateKey 'node'
  # Python check uses python - prefer 3.11+ packages
  $pythonInstalled = Ensure-Tool -Command 'python' -FriendlyName 'Python 3 (inkl. Pip)' -WingetId 'Python.Python.3.11' -ChocoPackage 'python' -ScoopPackage 'python' -StateKey 'python'
  if (-not $pythonInstalled -and -not (Resolve-PythonCommand)) {
    Write-Warning 'Python konnte nicht ermittelt werden. Stelle sicher, dass Python 3.11 installiert ist.'
  }
}

if (-not $SkipPythonSetup) {
  $pythonCommand = Resolve-PythonCommand
  $script:InstallMetadata['pythonCommand'] = $pythonCommand
  if ($pythonCommand) {
    try {
      $pythonVersionOutput = & $pythonCommand --version 2>&1
      if ($pythonVersionOutput) {
        if ($pythonVersionOutput -is [System.Array]) {
          $pythonVersionOutput = $pythonVersionOutput | Select-Object -First 1
        }
        $script:InstallMetadata['pythonVersion'] = $pythonVersionOutput.ToString().Trim()
      }
    } catch {
      # ignore version errors
    }
  }
  if (-not $pythonCommand) {
    Write-Warning 'Python wurde nicht gefunden. Überspringe virtuellen Python-Umgebungsschritt.'
    Update-InstallState -Key 'python-venv' -Present $false
  } else {
    Write-Step "Python Virtual Environment (.venv) einrichten"
    & $pythonCommand -m venv .venv
    $venvActivate = Join-Path (Resolve-Path '.venv').Path 'Scripts\Activate.ps1'
    $venvCreated = Test-Path $venvActivate
    Update-InstallState -Key 'python-venv' -Present $venvCreated
    if (Test-Path $venvActivate) {
      . $venvActivate
      Write-Step "pip aktualisieren"
      & python -m pip install --upgrade pip
      if (Test-Path 'requirements.txt') {
        Write-Step "Python-Abhängigkeiten installieren"
        & python -m pip install -r requirements.txt
      }
    } else {
      Write-Warning "Aktivierungsskript nicht gefunden: $venvActivate"
    }
  }
} else {
  Write-Host "(Python Setup übersprungen)"
}

if (-not $SkipNodeSetup) {
  if (-not (Test-CommandExists 'corepack')) {
    if (Test-CommandExists 'npm') {
      Write-Step 'Corepack global aktivieren (npm install -g corepack)'
      & npm install -g corepack | Out-Null
    } else {
      Write-Warning 'npm wurde nicht gefunden. Corepack kann nicht automatisch installiert werden.'
    }
  }

  if (Test-CommandExists 'corepack') {
    Write-Step 'Corepack aktivieren'
    & corepack enable
    Update-InstallState -Key 'corepack' -Present (Test-CommandExists 'corepack')
    Write-Step 'pnpm 10.17.0 vorbereiten'
    & corepack prepare pnpm@10.17.0 --activate
    Write-Step 'pnpm install --frozen-lockfile ausführen'
    & corepack pnpm install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "corepack pnpm install --frozen-lockfile endete mit Exit-Code $LASTEXITCODE. Versuche pnpm install erneut."
      if (Test-CommandExists 'pnpm') {
        & pnpm install
      } else {
        Write-Warning 'pnpm nicht verfügbar. Bitte pnpm manuell installieren.'
      }
    }
  } else {
    Write-Warning 'Corepack ist nicht verfügbar; installiere pnpm manuell (npm install -g pnpm).'
    Update-InstallState -Key 'corepack' -Present $false
  }
} else {
  Write-Host "(Node Setup übersprungen)"
}

Update-InstallState -Key 'corepack' -Present (Test-CommandExists 'corepack')
Update-InstallState -Key 'pnpm' -Present (Test-CommandExists 'pnpm')
Update-InstallState -Key 'nats-server' -Present (Test-CommandExists 'nats-server')
Update-InstallState -Key 'docker' -Present (Test-CommandExists 'docker')

if (Test-CommandExists 'node') {
  try {
    $nodeVersionOutput = & node --version 2>&1
    if ($nodeVersionOutput) {
      if ($nodeVersionOutput -is [System.Array]) {
        $nodeVersionOutput = $nodeVersionOutput | Select-Object -First 1
      }
      $script:InstallMetadata['nodeVersion'] = $nodeVersionOutput.ToString().Trim()
    }
  } catch {
    # ignore node version errors
  }
}

if (Test-CommandExists 'pnpm') {
  try {
    $pnpmVersionOutput = & pnpm --version 2>&1
    if ($pnpmVersionOutput) {
      if ($pnpmVersionOutput -is [System.Array]) {
        $pnpmVersionOutput = $pnpmVersionOutput | Select-Object -First 1
      }
      $script:InstallMetadata['pnpmVersion'] = $pnpmVersionOutput.ToString().Trim()
    }
  } catch {
    # ignore pnpm version errors
  }
}

if (Test-CommandExists 'corepack') {
  try {
    $corepackVersionOutput = & corepack --version 2>&1
    if ($corepackVersionOutput) {
      if ($corepackVersionOutput -is [System.Array]) {
        $corepackVersionOutput = $corepackVersionOutput | Select-Object -First 1
      }
      $script:InstallMetadata['corepackVersion'] = $corepackVersionOutput.ToString().Trim()
    }
  } catch {
    # ignore corepack version errors
  }
}

if (Test-CommandExists 'git') {
  Write-Step 'Git Konfiguration überprüfen'
  try {
    $name = git config --global user.name
    if (-not $name) {
      git config --global user.name 'your_name'
    }
  } catch {
    Write-Warning 'Konnte git user.name nicht lesen oder setzen.'
  }

  try {
    $email = git config --global user.email
    if (-not $email) {
      git config --global user.email 'your_email@example.com'
    }
  } catch {
    Write-Warning 'Konnte git user.email nicht lesen oder setzen.'
  }
}

function Write-InstallSummary {
  if ($script:InstallState.Keys.Count -eq 0) {
    return
  }

  Write-Step 'Installationsstatus'
  $script:InstallState.GetEnumerator() |
    Sort-Object -Property Name |
    ForEach-Object {
      $status = if ($_.Value) { 'ok' } else { 'fehlend' }
      Write-Host ("  {0,-16} : {1}" -f $_.Key, $status)
    }
}

Write-InstallSummary
Export-InstallReport -OutputPath $script:StateOutput
Write-Step 'Setup abgeschlossen. Öffne eine neue PowerShell für aktivierte PATH-Einstellungen bei Bedarf.'
