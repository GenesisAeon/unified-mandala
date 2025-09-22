# Stub Replacement Roadmap · Fraktal48

Unified Mandala führt weiterhin mehrere Python-Typstubs, um Forschungsabhängigkeiten (KAN, Liquid Time Constant Networks, Norse, Torch Geometric) in Offline- und Low-Mem-Umgebungen zu kapseln. Gleichzeitig liegt das Verzeichnis `keys/` leer im Repo und soll ausschließlich automatisiert verwaltete Secrets-Platzhalter enthalten. Dieser Fahrplan legt fest, wie wir die verbleibenden Stubs in produktive Artefakte überführen und sicherstellen, dass `keys/` nur über Deployment-Automation befüllt wird.

## 1. Inventur & Impact

| Pfad                                    | Typ          | Beschreibung                                                              | Aktueller Einsatz                                                                        |
| --------------------------------------- | ------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `stubs/kan_network.py`                  | Python Stub  | Minimaler Platzhalter für KAN-Layer-Klasse (`KANLayer`).                  | Verhindert Import-Errors in `packages/agents` Experimenten; keine reale Implementierung. |
| `stubs/liquid_time_constant_network.py` | Python Stub  | Platzhalter für Liquid Time Constant Netzwerke (`LTC`).                   | Wird über Forschungsadapter importiert; sorgt für Typkonsistenz in Offline-CI.           |
| `stubs/norse/`                          | Paketstub    | Spiegelt Teile der Norse-Spiking-Library nach (`__init__` + Untermodule). | Ermöglicht Tests ohne native Torch/Norse Abhängigkeiten.                                 |
| `stubs/torch_geometric/`                | Paketstub    | Vereinfachtes Torch-Geometric Interface.                                  | Dient als Fall-Back, wenn GPU-Abhängigkeiten nicht installiert sind.                     |
| `keys/`                                 | Secret-Mount | Leeres Verzeichnis für Deployment-Secrets.                                | Muss frei von manuellen Artefakten bleiben; nur Automation darf schreiben.               |

## 2. Zielzustand

1. **Produktive Backends statt Stubs** – Für jede Forschungsbibliothek existiert ein austauschbarer Adapter:
   - dynamische Importpfade (`importlib`) + Feature-Flags (`UM_ENABLE_EXPERIMENTAL_KAN`).
   - Fallback-Implementierungen mit klaren Capability-Flächen (z. B. `NotAvailableError`).
2. **CI-konforme Typen** – Stubs werden durch generierte Typinformationen ersetzt (`stubgen` + `pyright --createstub`).
3. **Secret Isolation** – `keys/` enthält `.gitignore` + `.gitkeep` als Automation-Markierungen;
   Repo-Sanity und die Kyverno-Policy `policies/kyverno.yaml` markieren unerwartete Dateien
   als Fehler, sodass PRs mit manuellen Artefakten blocken.

## 3. Umsetzungsetappen

### Phase A – Analyse & Tooling (Fraktal48 → Fraktal49)

- [ ] `scripts/check-stub-usage.mjs` anlegen: traversiert Python/TS-Code und listet Importe aus `stubs/`.
- [ ] CLI-Hook in `pnpm map:mandala` integrieren → MandalaMap verlinkt automatische Inventur.
- [ ] `pnpm sigillins:authoring status --json` in dashboards einbinden, um CREP/Trikāya-Kontext sichtbar zu halten.

### Phase B – Ersatzimplementierungen (Fraktal49 → Fraktal50)

- [ ] **KAN**: neues Paket `packages/agents-kan` mit optionaler Abhängigkeit `kan==0.1.*`; Laufzeit-Fallback wirft `RuntimeError` mit Installationshinweis.
- [ ] **LTC**: Wrapper um `liquid_time_constant_network` über `pip` extras (`extras_require['ltc']`).
- [ ] **Norse**/**Torch Geometric**: Compose-Profile `experimental-neuro` liefern Container mit GPU/CPU-sicheren Wheels; Stubs bleiben als reiner Typ-Fallback (`types-norse`).

### Phase C – Governance & Keys (Fraktal50 → Fraktal51)

- [x] Kyverno-Governance: `policies/kyverno.yaml` erzwingt, dass `keys/` nur `.gitignore/.gitkeep`
      enthält; Repo-Sanity prüft zusätzlich auf fehlende oder unerwartete Marker.
- [ ] Deployment-Pipeline aktualisieren: Secrets werden zur Laufzeit eingehängt (`kubectl create secret`), nicht committed.
- [ ] MandalaMap Follow-up → `done` sobald Kyverno/OPA-Policies greifen.

## 4. Automations-Hooks

- **MandalaMap**: Eintrag unter `follow_up` (Stub Replacement Roadmap) auf „in-progress/done“ setzen, wenn Phase B abgeschlossen.
- **Analysis Artefakte**: `analysis/trikaya-dashboard.*` zeigt CREP/Trikāya-Compliance der Bridges; dient als Governance-Sicht auf Sigillin-Autor:innen.
- **Sigillin CLI**: `pnpm sigillins:authoring status` liefert Echtzeit-Metriken zur Dashboard-Befüllung.

## 5. Verantwortlichkeiten & Zeitfenster

| Zeitraum | Deliverable                            | Owner                        |
| -------- | -------------------------------------- | ---------------------------- |
| KW 42    | Stub-Usage-Skript + MandalaMap Link    | ChefDevAI + Repositorypflege |
| KW 43    | KAN & LTC Adapter                      | DevX Guild                   |
| KW 44    | Norse/Torch Geometric Containerprofile | ReleaseOps Circle            |
| KW 45    | Keys-Governance (Kyverno/OPA)          | AI Governance Council        |

## 6. Nächste Schritte

- Phase-A-Aufgaben in `MandalaMap.*` markieren.
- CI-Guard vorbereiten (`scripts/check-stub-usage.mjs` als optionaler Check → `continue-on-error` bis Phasenabschluss).
- Keys-Ordner via `.gitkeep` sichern (Bestätigung in MandalaMap/Follow-ups).

_Siehe ebenfalls: `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` für Kontext zu Dist-First und Governance-Hooks._
