import React, { useState } from 'react';

/**
 * RAGSearchPanel provides a minimal UI to query the RAG API.
 * Suggestions originate from `newadvancedconversations.json`.
 */
export default function RAGSearchPanel() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const search = () => {
    fetch(`/rag/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((json) => setResult(json))
      .catch(() => setResult(null));
  };

  return (
    <div aria-label="RAGSearchPanel">
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>Search</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
