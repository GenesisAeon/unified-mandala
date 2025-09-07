# Mandala Review – Claude Focus (Ethics/Docs/Onboarding/UX)
## Kontext (kurz)
Wir haben Governance (P0–P3), Personhood-Gates, CI-Checks, Reports & Runner-Brücke.
## Bitte liefere:
1) **DOC-PATCHES** als Diff-Hunks (Markdown/YAML):
   ```diff title=docs/agents/QualityAssuranceAgent.md
   @@ ...
   + New section: Personhood escalation appeal flow
```
2. **RITUALS** (Markdown) als *fenced blocks*:
   ```markdown title=docs/rituals/ethics-escalation.md
   # Ethics Escalation Ritual
   ...
   ```
3. **CHANGESPEC** (YAML, maschinenlesbar; s. Format aus Mistral-Prompt)
## Review-Schwerpunkte
* **Ethik-Governance**: appeal/override Pfade klar & mensch-zentriert
* **Onboarding**: „erste 30 Minuten“ Guide
* **UX-Text**: knappe, verständliche Beschriftungen / Tooltips
* **Doku-Kohärenz**: Linkpfade, Glossar-Einträge
## Output-Format
Bitte **nur** in drei Abschnitten antworten – exakt so:
* `## DIFFS`
* `## DOCS/RITUALS`
* `## CHANGESPEC`
