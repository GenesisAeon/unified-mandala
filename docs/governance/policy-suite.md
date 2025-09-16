# Policy Suite Pipeline

Die **Policy Suite** bündelt alle Governance-Prüfungen (OPA, Kyverno und Guardrails) in einem konsistenten Lauf. Ziel ist eine einheitliche Sicht auf Sicherheits- und Compliance-Signale ohne die Entwickler mit drei separaten Workflows zu überfrachten.

## Komponenten

| Check           | Zweck                                                                                                                          | Quelle                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| OPA Governance  | Bewertet `policies/governance.rego` gegen `fixtures/events/example_input.json`. Liefert `allow=true` oder verweigert den Lauf. | `tools/opa-check.mjs`                                                      |
| Kyverno Dry-Run | Führt `policies/kyverno.yaml` als Dry-Run gegen das gleiche Fixture aus und meldet Policy-Abweichungen.                        | GitHub Action [`kyverno/action@v0.4.0`](https://github.com/kyverno/action) |
| Guardrails      | Überwacht Merge-Policies (z. B. „Policy-Änderungen benötigen Docs“) gegen den letzten Commit.                                  | `tools/governance-guardrails.mjs`                                          |

## CLI für lokale Dry-Runs

```bash
pnpm policy:check
```

- Führt OPA, Guardrails **und** den neuen Kyverno-Dry-Run-Fallback (`tools/kyverno-dry-run.mjs`) identisch zur CI aus.
- Schreibt Logs und ein JSON-Ergebnis nach `out/policy/` (ignored).
- Fehlende OPA-Binaries oder Docker werden als `Skipped` ausgewiesen – der Bericht markiert dies transparent.
- Der Kyverno-Fallback kann separat getestet werden:

  ```bash
  pnpm kyverno:validate -- --resource fixtures/events/example_input.json
  ```

  Der Runner simuliert die wichtigsten Pattern-Regeln der Policies und prüft das Fixture gegen `policies/kyverno.yaml`. Bei Abweichungen wird mit Exit-Code ≠ 0 abgebrochen.

### Artefakte

- `out/policy/policy-suite.json` – maschinenlesbare Ergebnisse.
- `out/policy/policy-suite-report.md` – Zusammenfassung, die auch im GitHub Step Summary landet.
- `out/policy/policy-suite-status.txt` – Enthält `passed` oder `failed`; der Workflow verwendet diese Datei, um den Lauf zu beenden.

## GitHub Workflow

`policy-check.yml` orchestriert alle Checks in einem Job:

1. Installation der Abhängigkeiten (Node 20 + pnpm 10.16.1).
2. `pnpm policy:check` (OPA + Guardrails) wird tolerant (`continue-on-error`) ausgeführt, damit anschließend der Bericht erstellt werden kann.
3. Kyverno läuft als dedizierter Schritt (ebenfalls tolerant).
4. `scripts/render-policy-suite-report.mjs` fasst beide Ergebnisse zusammen, aktualisiert Markdown + JSON und signalisiert Erfolg/Misserfolg über `policy-suite-status.txt`.
5. Der letzte Schritt beendet den Job hart, sobald ein Ergebnis `failed` meldet – keine `continue-on-error`-Schleifen mehr.

## Hinweise & TODOs

- Der lokale Fallback (`pnpm kyverno:validate`) kann bei Bedarf durch ein echtes CLI/Docker-Setup ersetzt werden (`POLICY_SUITE_SKIP_KYVERNO=1` deaktiviert den Node-Fallback für eigene Experimente).
- Bei Policy-Änderungen unbedingt eine erläuternde Dokumentation im gleichen PR aktualisieren – die Guardrails achten darauf.
- Die Summary-Datei eignet sich als Anhang für Fraktal-Protokolle oder Release-Notes (kopieren aus `out/policy/policy-suite-report.md`).
- Typische Guardrail-Meldungen und passende Fixes sind in `AI_POLICY.md` dokumentiert (Tabelle „Guardrail-Fehler & Maßnahmen“).

Damit ist der Governance-Check zentralisiert, transparent und CI-fest – im Sinne der Fraktalvorgabe „Stabilität vor Features“.
