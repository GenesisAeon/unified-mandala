## Dev Shortcuts (Windows/PowerShell)

```powershell
. ./scripts/dev-helper.ps1
Set-UMSecrets -ApiKey '<KEY>'      # schreibt apps/api/.env.local (gitignored)
Start-NATS                          # NATS via Docker hochfahren
Start-UM                            # alle Services (API 4000, Share 3001, Experiments 3002, RAG 3003, Flags 3004, Realtime 4020)
Start-UI -Port 5174                 # Vite UI
Smoke-UI                            # einfacher Reachability-Check
Smoke-AI -Message 'Hallo Aeon!'     # E2E-Check AI-Bridge (messages/input_text)
Health-Check                        # Einzelziel (default: http://localhost:4000/health)
pnpm dev:health                     # Aggregat: http://localhost:3999/health
Stop-UM                             # Ports freiräumen (3001/2/3/4, 4020/21)
```

Hinweise:

- Secrets niemals committen. `.env*` sind in `.gitignore`; Husky-Guard blockt versehentliche Commits.
- Node 20+ empfohlen. Bei Port-Konflikten: `pnpm dev:ports:free` oder `Stop-UM`.

### Maps / MandalaMap

- Lokal synchronisieren und prüfen:

```powershell
pnpm maps:sync              # baut RepoMap, validiert und prüft MandalaMap.*
pnpm repomap:build          # nur RepoMap erzeugen
pnpm repomap:validate       # RepoMap validieren
node scripts/mandala-map-validate.mjs  # MandalaMap.*-Konsistenz prüfen
```

- In PRs über Slash-Command triggern (erfordert CI): Kommentar `/run repomap` → Workflow `on-demand.yml` hängt das Label `run:repomap` an; `ci.core` führt dann die Repomap-Phase (`repomap_when_needed`) automatisch aus.

### Schnellere Commits (bei langsamer Umgebung)

- Nur Lint-Staged ausführen (schaltet schwere Hooks ab):

```powershell
[Environment]::SetEnvironmentVariable('UM_SKIP_HEAVY_HOOKS','1','User')
# GitHub Desktop neu starten, später Variable wieder entfernen
```

- Vollständige Prüfung manuell nachholen:

```powershell
pnpm check:precommit
```

### Live‑Profiles (CPU‑schonend)

- Minimalprofil (AI‑Bridge, Flags/Share, Health‑Aggregator):

```powershell
pnpm live:lite                # setzt Low‑Mem Defaults
pnpm dev:health               # Aggregator (falls nicht automatisch gestartet)
pnpm smoke:live               # Health + Chat E2E
```

- Standardprofil:

```powershell
pnpm live:std
```

- PowerShell Alias:

```powershell
pnpm ps:live-lite
```

### Ports & Offsets

- Zentrales Port‑Mapping via `config/ports.ts`. Optionaler Offset schiebt alle Ports:

```powershell
$env:PORT_OFFSET = '100'       # verschiebt 3001→3101, 4000→4100, 3999→4099, ...
pnpm live:std
```

- Preflight (Ports vor Start freiräumen):

```powershell
pnpm preflight:freeports
pnpm live:std:clean
```
