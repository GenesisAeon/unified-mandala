param(
  [string]$Output = "build"
)

Write-Host "Building Windows helper tools..."

if (-not (Test-Path $Output)) {
  New-Item -ItemType Directory -Path $Output | Out-Null
}

Get-ChildItem -Path $PSScriptRoot -Filter *.cs | ForEach-Object {
  $file = $_
  $name = $file.BaseName
  Write-Host "Compiling $name"
  try {
    dotnet build $file.FullName -o (Join-Path $Output $name) | Out-Null
  } catch {
    $errorRecord = $_
    $message = if ($errorRecord.Exception) { $errorRecord.Exception.Message } else { $errorRecord.ToString() }
    Write-Warning ("Failed to compile {0}: {1}" -f $file.FullName, $message)
  }
}

Write-Host "Windows tools build complete."

