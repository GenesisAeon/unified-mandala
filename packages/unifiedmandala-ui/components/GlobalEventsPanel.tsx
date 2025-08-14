import React, { useEffect, useState } from 'react';

/**
 * GlobalEventsPanel fetches cosmic, crisis and positive events
 * from the `/global-events` endpoint and displays the raw
 * response. Inspired by design fragments in
 * `newadvancedconversations.json`.
 */
export default function GlobalEventsPanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/global-events')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div aria-label="GlobalEventsPanel">Loading...</div>;
  }

  return (
    <div aria-label="GlobalEventsPanel">
      <h2>Global Events</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
