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
