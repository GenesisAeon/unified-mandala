import React, { useEffect, useState } from 'react';

/**
 * ClimateSocialPanel fetches aggregated climate and social metrics
 * from the `/process` endpoint and displays the raw response.
 * The component was scaffolded from design fragments in
 * `newadvancedconversations.json`.
 */
export default function ClimateSocialPanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_type: 'climate_fetch', crep_score: 0.75 }),
    })
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div aria-label="ClimateSocialPanel">Loading...</div>;
  }

  return (
    <div aria-label="ClimateSocialPanel">
      <h2>Climate &amp; Social Metrics</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
