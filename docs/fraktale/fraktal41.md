# Fraktal41 – Policy-Härtung und Stabilisierung

## Zusammenfassung

Fraktal41 schließt den Stabilisierungsschritt aus Fraktal40 ab. Der Fokus lag auf einer konsequenten Fail-Fast-Strategie für alle Governance-Pipelines und einer technischen Vorbereitung für die nachfolgenden Stabilisierungssprints. Die Policy-Suite bündelt jetzt OPA, Guardrails und Kyverno in einem konsistenten Lauf, und die Experimental-CI stoppt sofort bei Verstößen. Dokumentation und Codex-Feedback verlinken die Ergebnisse direkt mit dem v1.0-Stabilisierungsfahrplan.

## Technische Maßnahmen

- **CI Core**: Ausgabe der Toolchain-Versionen (Node.js, PNPM, Python) und konsequenter Abbruch, sobald `pnpm test:ts:ci`, `pnpm test:py` oder `npx pyright` fehlschlagen.
- **CI Experimental**: Entfernung aller `|| true`-Platzhalter. Kyverno-, OPA- und Guardrails-Checks laufen in `pnpm policy:check` zusammen. Ergebnisse werden als Artefakt (`out/policy/`) veröffentlicht, bevor der Job bei Fehlern beendet wird.
- **Policy-Suite**: `scripts/policy-suite.mjs` erzeugt JSON- und Markdown-Berichte, behandelt fehlende Binaries als „skipped“ und setzt den Exit-Code, sobald ein Check fehlschlägt. `render-policy-suite-report.mjs` fasst den Status für GitHub Actions zusammen.
- **Dist-First**: Produktionspfade laufen über vorcompilierte Artefakte (`pnpm build && pnpm start:services`). Restliche `ts-node`-Verwendungen bleiben als technische Schuld markiert (Follow-up in Fraktal42+).

## Governance & Dokumentation

- `docs/governance/policy-suite.md` beschreibt die neue Pipeline samt Artefakten (`policy-suite.json`, `policy-suite-report.md`).
- Guardrail-Regeln erzwingen, dass Policy-Änderungen eine begleitende Dokumentationsaktualisierung enthalten.
- `codexfeedback.*` spiegelt den Laufstatus und verweist auf das Stabilisierungs-Playbook (`docs/roadmap/v1.0-stabilization-playbook.*`).

## Offene Themen für Fraktal42+

1. **Dist-First überall**: Alle verbleibenden `ts-node`/`tsx`-Aufrufe durch gebaute Artefakte ersetzen.
2. **Nightly Extended Tests**: Coverage-Reports selektiv aktivieren, sobald Flakes eliminiert sind.
3. **Monitoring**: Prometheus- und Grafana-Profile in Docker Compose aktivieren und `/metrics` für alle Services vereinheitlichen.
4. **AI Governance Primer**: Praxisleitfaden für Guardrail-Fehler und Korrekturen in `AI_POLICY.md` dokumentieren.

## Artefakte

- `docs/roadmap/v1.0-stabilization-playbook.md`
- `docs/roadmap/v1.0-stabilization-playbook.yaml`
- `scripts/policy-suite.mjs`
- `.github/workflows/ci.experimental.yml`

Diese Sammlung dient als Startpunkt für Fraktal42, in dem Observability- und Smoke-Test-Aufgaben priorisiert werden.
