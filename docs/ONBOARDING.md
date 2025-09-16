# Onboarding

## 🚀 Stabiler Setup-Pfad (Fraktal40+)

```bash
./scripts/setup-dev-env.sh    # optional: richtet Node/Python + pnpm ein
pnpm build                    # erzeugt dist/ Artefakte für alle Services
pnpm start:light              # liefert dist/ auf http://127.0.0.1:3000 (Ctrl+C zum Stoppen)
pnpm policy:check             # OPA + Guardrails + Kyverno (gleich wie CI)
pnpm test:ts:ci               # Vitest Kern-Suite
pnpm test:py                  # Pytest Kern-Suite
npx pyright                   # Typprüfung für Python

# Monitoring-Profil einschalten (optional)
docker compose --profile monitoring up -d
# → Prometheus: http://localhost:9090, Grafana: http://localhost:3001
```

Damit spiegelst du lokal exakt die Gates, die im CI-Core verlangt werden. Für Hot-Reload kann im Anschluss `pnpm dev:ui` oder `pnpm dev:services` gestartet werden.

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
```

### Services starten

```bash
# Development (Hot Reload via tsx)
pnpm dev:services

# Production Preview (setzt pnpm build voraus)
pnpm start:services
```
