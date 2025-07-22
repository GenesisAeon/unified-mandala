# Boundary Law Manifest

Dieses Manifest fasst die in den Gesprächen beschriebenen Konzepte zu Grenzregeln zusammen. Ziel ist es, ein formales Schema für die "Boundary Law Discovery Engine" bereitzustellen.

## Beispieldefinition
```yaml
boundary_rule:
  name: Oberflächenspannung
  system_1: "Flüssigkeit"
  system_2: "Molekularsystem"
  domain: "1-10 nm"
  signature: "γ = F/l"
  emergent_effects:
    - "Tropfenbildung"
    - "Kapillareffekt"
  macro_recurrence:
    - "Organismenhüllen"
```

Weitere Regeln werden iterativ ergänzt. Das Manifest dient als Ausgangspunkt für die Implementierung der Boundary‑Engine.
