# Policy Guide for Go Agent

Diese Anleitung beschreibt, wie der Go Agent Policies prüft und anwendet.

## Policy Definition
Policies werden als YAML-Dateien unter `config/policies/` abgelegt.

```yaml
# config/policies/sample-policy.yaml
id: basic-example
rules:
  - type: rate-limit
    limit: 100
  - type: allow-tags
    tags: ["sigil", "analysis"]
```

## Enforcement
1. Der Agent lädt beim Start alle aktiven Policies.
2. Eingehende Jobs werden gegen die Regeln geprüft.
3. Verstöße werden protokolliert und der Job verworfen.

## Empfehlungen
- Policies versionieren und in CI testen.
- Kombiniere Policy-Prüfungen mit ML-Priorisierung für robuste Workflows.

