# Onboarding

## ⚙️ Setup & Toolchain

```bash
# optional: geführtes Setup inkl. Python/Node Hooks
./scripts/setup-dev-env.sh

# manuell (falls benötigt)
node -v                     # Node >= 20
corepack enable
corepack prepare pnpm@10.16.1 --activate
pnpm install --frozen-lockfile
pnpm build                  # dist-first Artefakte erzeugen
cp .env.example .env        # eigene Secrets setzen
```

- **Policy-Suite** lokal prüfen:

  ```bash
  pnpm policy:check
  ```

  Ergebnisse landen unter `out/policy/` und spiegeln exakt die CI.

## 🧪 Test Your Sigil

1. Erstelle eine Test-YAML in `tests/fixtures/sigillin/` (z. B. `my-sigil.yaml`).
2. Validiere sie:
   ```bash
   pnpm test:sigil tests/fixtures/sigillin/my-sigil.yaml
   ```
3. **Erwartete Ausgabe**:
   - ✅ `Valid sigil` → Alles OK.
   - ❌ `Invalid sigil: ...` → Fehler beheben (siehe [FORMATS.md](sigils/FORMATS.md)).

## 🌍 Test Adapter

```bash
# OISST mit Fixture bauen (kein Netzwerk nötig)
pnpm adapter:build:oisst
```

### Fraktal19 quick run

```bash
# type safety + sigils + stac + resonance calc
pnpm lint
pnpm sigils:scan && pnpm stac:validate && pnpm sigils:index
pnpm exec tsx scripts/resonance-calc.ts

# adapters (offline)
pip install -r src/adapters/requirements.txt
CI=true pnpm adapter:build:oisst
```

### Quick CI Smoke

```bash
pnpm install
pip install -r requirements.txt
CI=true pnpm adapter:build:oisst
pnpm stac:validate
pnpm resonance:calc
pnpm test:unit           # Coverage für Kernmodule
pnpm policy:check        # Governance-Gates
```

### Services starten

```bash
# Development (Backend/Services Stack)
pnpm dev:stack

# UI Hot Reload (zweite Shell)
pnpm dev

# Production Preview (setzt pnpm build voraus)
pnpm start:services

# Static Preview nach Build
pnpm dev:services

# Monitoring-Profil (Prometheus/Grafana) aktivieren
docker compose --profile monitoring up
```
