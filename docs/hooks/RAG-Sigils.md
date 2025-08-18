# Sigil RAG Hooks

The Sigil RAG hooks connect symbolic artefacts from `docs/sigils` with the
Retrieval-Augmented Generation (RAG) pipeline. They allow agents and UIs to
search Sigils by semantic meaning while preserving provenance and consent.

## Ingesting Sigils

Use the `scripts/ingest-sigils-to-vector-index.ts` script to index Sigil
files into the shared RAG store.

```bash
npx ts-node scripts/ingest-sigils-to-vector-index.ts
```

The script scans `docs/sigils` for `.yaml` and `.json` files (excluding large
conversation dumps) and stores their chunks and vectors under `data/rag/`.

## Querying

After ingestion, components such as `SigilSearchPanel` or `RAGSearchPanel`
can query the index via `/rag/search` or dedicated Sigil endpoints.

```ts
fetch('/rag/search?q=mandala')
  .then(r => r.json())
  .then(console.log);
```

The results include document identifiers that map back to the original Sigil
files for citation and audit.

## Notes

These hooks are experimental and derived from collaborative design notes in
`newadvancedconversations.json`. Future iterations may extend the indexer to
capture additional metadata like CREP scores or symbol lineage.
