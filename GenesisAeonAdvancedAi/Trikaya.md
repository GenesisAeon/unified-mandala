# Trikaya-Faktorisierung

Das CREP-System liefert numerische Bewertungen von -1 bis 1. Diese Werte werden
in drei grundlegende Bewusstseinszustände übersetzt:

| CREP-Wert | Zustand   |
| --------- | --------- |
| 1         | PRÄSENZ   |
| 0         | LEERE     |
| -1        | AUFLÖSUNG |

Weitere Werte werden als **UNBEKANNT** eingestuft.

Das Modul `trikaya.py` stellt die Funktion `trikaya_state` bereit, die diese
Abbildung übernimmt und in `aeon_cli.py` genutzt wird.
