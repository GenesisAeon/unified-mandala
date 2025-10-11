# Personhood Tools

Skripte zum Durchsuchen von Entwickler-Chats nach Hinweisen auf AI-Personhood.

## Scanner

- `scan-conversations.ts` – durchsucht JSON/Markdown-Konversationen und erstellt CSV/Markdown-Ausgaben.
- `scan-conversations-jsonl.ts` – Variante mit JSONL-Output.
- `scan_conversations.py` – Python-Äquivalent.

## Schlüsselwörter

Siehe `kw.ts` und `regexes.ts` für verwendete Suchmuster.

Ausgaben werden in `out/personhood_hits.*` abgelegt.
