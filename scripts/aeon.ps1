param([Parameter(Position=0)][string]$cmd)

function nats_up { docker compose -f infrastructure/nats/docker-compose.yml up -d }
function nats_down { docker compose -f infrastructure/nats/docker-compose.yml down }
function bus_smoke_memory { node --loader ts-node/esm tools/bus-smoke.ts }
function bus_smoke_nats { $env:BUS_MODE="nats"; node --loader ts-node/esm tools/bus-smoke.ts }

switch ($cmd) {
  "nats_up" { nats_up }
  "nats_down" { nats_down }
  "bus_smoke" { bus_smoke_memory }
  "bus_smoke_nats" { bus_smoke_nats }
  default { Write-Host "Usage: .\scripts\aeon.ps1 [nats_up|nats_down|bus_smoke|bus_smoke_nats]" }
}
