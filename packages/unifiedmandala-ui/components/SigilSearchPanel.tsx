import React, { useEffect, useState } from 'react';

/**
 * SigilSearchPanel queries the sigil search API and displays matches.
 * It can start with an optional initial query.
 */
export default function SigilSearchPanel({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);

  const search = (q: string) => {
    fetch(`/api/sigils?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((json) => setResults(json.results || []))
      .catch(() => setResults([]));
  };

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div aria-label="SigilSearchPanel">
      <input placeholder="Search sigils" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => search(query)}>Search</button>
      {results.length > 0 && (
        <ul>
          {results.map((r, idx) => (
            <li key={idx}>{r.file}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
