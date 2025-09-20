[CmdletBinding()]
param(
  [switch]$SkipPackageInstall,
  [switch]$SkipPythonSetup,
  [switch]$SkipNodeSetup
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Step {
  param([string]$Message)
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
  param([string]$Name)
  return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
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
    [string]$ScoopPackage
  )

  if (Test-CommandExists $Command) {
    Write-Host "✓ $FriendlyName verfügbar ($Command)"
    return $true
  }

  if (-not $script:PackageManager) {
    Write-Warning "Kein unterstützter Paketmanager gefunden, um $FriendlyName zu installieren. Bitte manuell installieren."
    return $false
  }

  $installed = Invoke-PackageInstall -Manager $script:PackageManager -FriendlyName $FriendlyName -WingetId $WingetId -ChocoPackage $ChocoPackage -ScoopPackage $ScoopPackage
  if ($installed -and Test-CommandExists $Command) {
    Write-Host "✓ $FriendlyName erfolgreich installiert"
    return $true
  }

  Write-Warning "$FriendlyName konnte nicht automatisch installiert werden. Bitte manuell installieren und Skript erneut starten."
  return $false
}

function Resolve-PythonCommand {
  if (Test-CommandExists 'python') { return 'python' }
  if (Test-CommandExists 'py') { return 'py' }
  return $null
}

Write-Step "Windows Entwicklungsumgebung initialisieren"

$script:PackageManager = Get-PackageManager
if ($SkipPackageInstall) {
  Write-Host "(Paketinstallation übersprungen)"
} elseif (-not $script:PackageManager) {
  Write-Warning "Weder winget, Chocolatey noch Scoop gefunden. Installiere Git, Node.js und Python manuell und führe das Skript erneut aus."
} else {
  Ensure-Tool -Command 'git' -FriendlyName 'Git' -WingetId 'Git.Git' -ChocoPackage 'git' -ScoopPackage 'git'
  Ensure-Tool -Command 'node' -FriendlyName 'Node.js (LTS)' -WingetId 'OpenJS.NodeJS.LTS' -ChocoPackage 'nodejs-lts' -ScoopPackage 'nodejs-lts'
  # Python check uses python - prefer 3.11+ packages
  $pythonInstalled = Ensure-Tool -Command 'python' -FriendlyName 'Python 3 (inkl. Pip)' -WingetId 'Python.Python.3.11' -ChocoPackage 'python' -ScoopPackage 'python'
  if (-not $pythonInstalled -and -not (Resolve-PythonCommand)) {
    Write-Warning 'Python konnte nicht ermittelt werden. Stelle sicher, dass Python 3.11 installiert ist.'
  }
}

if (-not $SkipPythonSetup) {
  $pythonCommand = Resolve-PythonCommand
  if (-not $pythonCommand) {
    Write-Warning 'Python wurde nicht gefunden. Überspringe virtuellen Python-Umgebungsschritt.'
  } else {
    Write-Step "Python Virtual Environment (.venv) einrichten"
    & $pythonCommand -m venv .venv
    $venvActivate = Join-Path (Resolve-Path '.venv').Path 'Scripts\Activate.ps1'
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
  }
} else {
  Write-Host "(Node Setup übersprungen)"
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

Write-Step 'Setup abgeschlossen. Öffne eine neue PowerShell für aktivierte PATH-Einstellungen bei Bedarf.'
