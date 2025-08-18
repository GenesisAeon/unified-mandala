# VECTOR_INDEX_URL

The `VECTOR_INDEX_URL` environment variable specifies the endpoint of the vector index service.
Use it to direct ingestion and search scripts to the correct API.

```bash
# example: local development
export VECTOR_INDEX_URL="http://localhost:9000"
```

Add this variable to your shell profile or `.env` file before running scripts like
`ingest-sigils-to-vector-index.ts` or other RAG utilities.
