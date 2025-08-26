param(
  [string]$Output = "build"
)

Write-Host "Building Windows helper tools..."

if (-not (Test-Path $Output)) {
  New-Item -ItemType Directory -Path $Output | Out-Null
}

Get-ChildItem -Path $PSScriptRoot -Filter *.cs | ForEach-Object {
  $name = $_.BaseName
  Write-Host "Compiling $name"
  try {
    dotnet build $_.FullName -o (Join-Path $Output $name) | Out-Null
  } catch {
    Write-Warning "Failed to compile $_: $_"
  }
}

Write-Host "Windows tools build complete."

