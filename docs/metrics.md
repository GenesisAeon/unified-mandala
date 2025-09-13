# Metrics Singleton

Alle Prometheus-Metriken registrieren sich auf **REG**, eine gemeinsame Registry.
Default-Metriken werden genau einmal über `ensureDefaultMetrics()` initialisiert.
Eigene Metriken sollten mit `getOrCreate*`-Helpern erzeugt werden und niemals eine
neue `Registry` anlegen.
