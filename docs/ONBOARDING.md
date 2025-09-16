# Onboarding

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

## ⚙️ Service-Orchestrator

```bash
# DEV: tsx-Fallback nutzt TypeScript direkt
pnpm dev:services

# Dist-Build für Production-Smokes
pnpm build:dist
pnpm start:services
# Fehlt ein Dist-Artefakt, meldet das Skript einen tsx-Fallback pro Service.

# Dist-Modus erzwingen (z. B. in CI-Shells)
MANDALA_SERVICES_DIST=1 pnpm dev:services
```

### Fraktal19 quick run

```bash
# type safety + lint + sigils + stac + resonance calc
pnpm lint
pnpm format:check
pnpm sigils:scan && pnpm stac:validate && pnpm sigils:index
pnpm exec node tools/schema-validate.mjs
pnpm exec node tools/governance-check.mjs
pnpm resonance:calc

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
pnpm build:dist
# Optional Smoke (beendet mit Ctrl+C):
# MANDALA_SERVICES_DIST=1 pnpm dev:services
```
