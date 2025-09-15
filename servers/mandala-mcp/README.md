# Mandala MCP Server

Ein leichter, strikt read-only konzipierter Model Context Protocol (MCP) Server, der Unified Mandala Kennzahlen und Repo-Orientierung für kollaborative KI-Tools bereitstellt.

## Features

- 🔐 **Sicherheit**: Stdio-Transport, Pfad-Whitelist mit `realpath` und Tool-spezifische Rate-Limits.
- 🧭 **Repo-Orientierung**: Liefert strukturierte RepoMap-Daten inklusive Fallback, falls Analysen fehlen.
- 📊 **KPIs & CREP**: Holt Daten aus `MANDALA_API` (nur erlaubte Hosts) oder nutzt lokale Demo-Dateien (`data/kpis.json`, `data/crep-resonance.json`).
- 🧾 **Audit**: Schreibt NDJSON-Einträge mit Laufzeit, Erfolgsstatus und Node-Version nach `servers/mandala-mcp/logs/audit.ndjson`.

## Nutzung

```bash
# Entwicklung (Stdio)
pnpm --dir servers/mandala-mcp dev

# Produktion
pnpm --dir servers/mandala-mcp build
pnpm --dir servers/mandala-mcp start
```

Optionale Umgebungsvariablen:

- `MANDALA_API`: Basis-URL einer kompatiblen Mandala-API (nur `127.0.0.1` und `localhost` erlaubt, override via `MCP_ALLOWED_HOSTS`).
- `MCP_ALLOWED_HOSTS`: Komma-separierte Hostliste.
- `MANDALA_REPO_ROOT`: Erzwingt einen spezifischen Repo-Root (Default: zwei Ebenen über dem Server).

## Tools

| Tool | Beschreibung |
| --- | --- |
| `health` | Health-Check inkl. Version und Node-Infos. |
| `get_kpi_list` | Liefert KPI-Dashboard-Daten (Zod-validiert). |
| `get_crep_resonance` | Gibt aktuelle CREP-Resonanz (0..1) zurück. |
| `query_repo_map` | Liest RepoMap YAML/JSON und liefert strukturierte Ebenen. |

Tests und Type-Checks:

```bash
pnpm --dir servers/mandala-mcp run typecheck
pnpm --dir servers/mandala-mcp test
```

## Integration in ChatGPT (Developer Mode)

1. **Add MCP Server** → Local process (stdio)
2. Command: `pnpm`
3. Arguments: `--dir`, `servers/mandala-mcp`, `dev`
4. Optional: `MANDALA_API=http://127.0.0.1:3000`

Die Tools erscheinen anschließend in der Tool-Liste. Alle Antworten sind strikt read-only und werden validiert.
