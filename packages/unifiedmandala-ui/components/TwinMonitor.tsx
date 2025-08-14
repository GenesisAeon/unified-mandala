import React, { useEffect, useState } from 'react';

/**
 * TwinMonitor fetches the digital twin bridge status from the backend
 * and displays the raw response for inspection.
 * The component originates from design fragments in
 * `newadvancedconversations.json` referencing TwinMonitor.
 */
export default function TwinMonitor() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/digital-twin/status')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div aria-label="TwinMonitor">Loading...</div>;
  }

  return (
    <div aria-label="TwinMonitor">
      <h2>Digital Twin Bridge Status</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
