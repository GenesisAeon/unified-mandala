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
### Fraktal19 quick run
```bash
# type safety + sigils + stac + resonance calc
npx tsc -p tsconfig.json --noEmit
pnpm sigils:scan && pnpm stac:validate && pnpm sigils:index
node --loader ts-node/esm scripts/resonance-calc.ts

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
```
