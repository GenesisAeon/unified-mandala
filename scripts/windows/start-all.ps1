# Start all development APIs on Windows with predefined ports
param(
  [string]$Manager = "pnpm"
)

Write-Host "Starting development services via $Manager..."
if ($Manager -ieq "npm") {
  npm run start:all
} else {
  pnpm run start:all
}
