import React, { useEffect, useState } from 'react';

interface ConsentRecord {
  id: string;
  subject: string;
  granted: boolean;
  grantedAt: string;
}

/**
 * ConsentTimeline displays a list of active consent records
 * fetched from the admin API.
 */
export default function ConsentTimeline() {
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/consents')
      .then((r) => r.json())
      .then((data) => setRecords(data.consents || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div aria-label="ConsentTimeline">
      <h2>Consent Timeline</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {records.map((c) => (
            <li key={c.id}>
              {c.subject}: {c.granted ? 'granted' : 'revoked'} at {c.grantedAt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
