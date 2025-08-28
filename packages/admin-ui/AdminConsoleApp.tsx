import React, { useEffect, useState } from 'react';

interface ServiceStatus {
  name: string;
  healthy: boolean;
}

/**
 * AdminConsoleApp provides a minimal overview of service health
 * and consent status fetched from the admin API.
 */
export default function AdminConsoleApp() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/status')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div aria-label="AdminConsoleApp">
      <h1>Admin Console</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {services.map((s) => (
            <li key={s.name}>
              {s.name}: {s.healthy ? 'ok' : 'fail'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
