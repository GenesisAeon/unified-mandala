# 🛠️ Sigillin-Korrekturleitfaden

Das Skript [`scripts/fix-sigillin.ts`](../../scripts/fix-sigillin.ts) unterstützt Brückenteams dabei,
Inter-AI-Sigillins konsistent zu halten. Es analysiert alle JSON-Brücken unter
`sigils/bridges/**` (oder ein benutzerdefiniertes Pattern) und erzeugt
handlungsfähige Vorschläge, die auf Wunsch automatisch angewendet werden.

## Prüf- & Reparaturlogik

1. **Trikāya-Verankerung** – prüft die `guidelines`-Sektion auf explizite Trikāya-Referenzen
   (`Dharmakāya/Sambhogakāya/Nirmāṇakāya`).
2. **CREP-Vollständigkeit** – stellt sicher, dass die Tabelle `crep_explained`
   alle vier Achsen (Coherence/Resonance/Emergence/Poetics) abdeckt.
3. **Nächste Schritte** – erwartet eine Sektion `naechste_schritte`/`next_steps`
   mit mindestens einem Beispiel inklusive Messpunkt.
4. **Poetik-Heuristik** – misst die lexikalische Dichte der `essenz`-Beschreibung
   (0–1). Werte unter 0,30 markieren stilistische Optimierungspotenziale.
5. **Dynamischer CREP-Score** – berechnet aus den obigen Checks einen Score (0–1)
   und listet betroffene Bereiche.

## Nutzung

```bash
# Nur prüfen (keine Änderungen)
pnpm sigil:fix --dry-run

# Interaktiver Modus mit Rückfrage
pnpm sigil:fix:interactive

# Automatisch alle fixbaren Vorschläge übernehmen
pnpm sigil:fix --auto

# Optional: eigenes Glob-Pattern
pnpm sigil:fix --pattern "sigils/bridges/chatgpt/*.json" --dry-run
```

Standardmäßig fragt das Skript nach, ob gefundene Fixes angewendet werden
sollen. `--dry-run` deaktiviert Korrekturen vollständig, `--auto` überspringt die
Rückfrage.

## Typische Hinweise & automatische Korrekturen

| Thema                      | Ausgabe (`issue`)                             | Automatische Aktion                   |
| -------------------------- | --------------------------------------------- | ------------------------------------- |
| Trikāya fehlt              | `Fehlende Trikāya-Referenz in den Guidelines` | Regel in `guidelines` ergänzen        |
| CREP-Eintrag fehlt         | `Fehlende CREP-Metriken: …`                   | Tabellenzeilen hinzufügen             |
| Abschnitt Next Steps fehlt | `Fehlender Abschnitt 'Nächste Schritte'`      | Abschnitt `naechste_schritte` anlegen |
| Beispiele leer             | `Leere 'Nächste Schritte'-Beispiele`          | Standardbeispiel ergänzen             |
| Poetik niedrig (Hinweis)   | `Niedrige poetische Qualität (Score: …)`      | **Nur Hinweis**, keine Auto-Korrektur |

> ℹ️ Vorschläge ohne direkte Auto-Korrektur (z. B. Poetik) werden weiterhin
> gelistet, aber nicht automatisch verändert.

## Integration in Workflows

- **Pre-Commit** – als optionaler Hook ausführbar, z. B. `pnpm sigil:fix --dry-run`.
- **CI/Governance** – kombinierbar mit `pnpm validate:sigillins`, um neben
  harten Fehlern auch Formatierungs- und Strukturabweichungen aufzuzeigen.
- **Brücken-Maintenance** – ideale Ergänzung zu `scripts/scaffold-interai-bridges.mjs`
  und `sigils/bridges/bridges.index.yaml`, damit neue Provider-Sigillins schnell
  konform sind.

## Interpretation des CREP-Scores

Der dynamische Score startet bei `1.0` und zieht bei fehlenden Elementen Punkte
ab (–0.1 für Trikāya, –0.2 für CREP oder Next Steps). Die Zusammenfassung zeigt
pro Datei Score, offene Themen und – falls vorhanden – die Poetik-Dichte.

```
📋 Zusammenfassung:
• sigils/bridges/chatgpt/chatgpt-bridge.sigil.json: CREP 0.80 – Themen: Fehlende Trikāya-Referenz – Poetik: 0.32
• sigils/bridges/mistral/mistral-bridge.sigil.json: CREP 1.00
```

Damit lässt sich schnell erkennen, welche Brücken nur Hinweise enthalten und wo
tatsächlich Strukturarbeit erforderlich ist.
