# Befehlskatalog (Scripts & Tools)

## Personhood – Dev-Chats scannen

- TS (JSON-Array):  
  `pnpm dlx tsx scripts/personhood/scan-conversations.ts`
- TS (JSONL):  
  `pnpm dlx tsx scripts/personhood/scan-conversations-jsonl.ts`
- Python (JSON-Array):  
  `python3 scripts/personhood/scan_conversations.py`

Outputs:

- `out/personhood_hits.csv` (tab)
- `out/personhood_hits.md` (lesbar)

## Ähnlichkeits-Gerüst (optional)

- Index bauen:  
  `ts-node scripts/personhood/similarity-index.ts --inputs out/personhood_hits.md docs/governance/HI-Compact.md AI_POLICY.md`
- Query:  
  `ts-node scripts/personhood/similarity-query.ts --text "AI-Person → river rights Analogie"`

## Repo-Hilfen

- Skripte listen:  
  `ts-node scripts/repo/list-scripts.ts`
- Command-Index generieren (erkenne Usage-Strings):  
  `ts-node scripts/repo/command-index.ts`
