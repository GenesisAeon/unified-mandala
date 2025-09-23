# Cosmic-Web Demo · Quickstart (Fraktal70)

Die Cosmic-Web-Demo verbindet deterministische CREP-Metriken mit Sigillin-/STAC-Artefakten und einem animierten Canvas im Mandala-UI. Dieses Dokument bündelt die plattformübergreifenden Schritte, damit Setup, Artefaktgenerierung und Realtime-Telemetrie konsistent laufen.

## 1. Voraussetzungen

- Node.js ≥ 20 inklusive Corepack
- pnpm 10.17.0 (Aktivierung via Corepack, siehe unten)
- (Optional) Python-Tooling für Adapter/ERA-Demos (`requirements.txt`, `src/adapters/requirements.txt`)
- (Optional) Docker, falls NATS via Helper-Skript (`pnpm nats:docker`) gestartet werden soll
- (Optional) `PANTHEON_DISABLE=1`, um Analytics lokal abzuschalten

### Windows PowerShell (v5+)

> PowerShell 5 kennt kein `&&`. Befehle einzeln oder mit `;` ausführen.

```powershell
corepack enable; corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
$env:PANTHEON_DISABLE = '1'      # optional
```

### macOS / Linux (bash/zsh)

```bash
corepack enable && corepack prepare pnpm@10.17.0 --activate
pnpm i --frozen-lockfile
python -m pip install -r requirements.txt
python -m pip install -r src/adapters/requirements.txt
export PANTHEON_DISABLE=1       # optional
```

## 2. Artefakte erzeugen & UI starten

```bash
pnpm demo:cosmic                # Daten, Sigillin, STAC-Item generieren & in apps/ui/public veröffentlichen
```

Falls das Kombiscript keinen Vite-Server startet oder Port 5173 bereits belegt ist:

```bash
pnpm -F mandala-ui dev -- --port 5173
```

Danach im Browser `http://localhost:5173/demo/cosmic-web` aufrufen.

## 3. Realtime-Ticks (optional)

```bash
pnpm nats:docker                # startet NATS auf nats://localhost:4222
pnpm demo:cosmic:tick           # publiziert Live-Ticks
```

> Hinweis: Port 4222 ist ein reiner TCP-Port für NATS. Ein Browser-Request beantwortet der Server mit `-ERR 'Unknown Protocol Operation'` – das ist korrekt.

## 4. Live-Events beobachten

### Node Subscriber

```bash
pnpm sub:cosmic
# Variablen anpassbar:
# COSMIC_SUBJECT=demo.cosmic NATS_URL="nats://localhost:4222 nats://backup:4223" pnpm sub:cosmic
# COSMIC_QUEUE=cosmic-workers pnpm sub:cosmic
```

Der Subscriber dekodiert JSON-Payloads lesbar, akzeptiert mehrere NATS-Server (Komma oder Leerzeichen getrennt), nutzt standardmäßig das Subject `demo.cosmic` (Publisher sendet identisch) und beendet die Verbindung sauber via `Ctrl+C` (`SIGINT`).

### NATS CLI (Alternative)

```bash
nats sub "demo.cosmic" -s nats://localhost:4222
```

## 5. Dev-Tipps

- Subjects in `scripts/realtime/cosmic-publisher.mjs` gegen UI und Subscriber abgleichen.
- Für gezielte Tests des CREP-Workspaces steht `pnpm test:unit:crep` bereit.
- Weitere Troubleshooting-Hinweise (JetStream, Ports, Quickstart) finden sich in README.md, docs/roadmap/v1.0-stabilization-playbook._ und MandalaMap._
