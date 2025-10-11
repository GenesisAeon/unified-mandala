import React, { useEffect, useState } from 'react';

interface Flag {
  name: string;
  enabled: boolean;
}

/**
 * FeatureFlagsPanel renders toggle switches for feature flags.
 * It fetches flag states from `/flags` and posts updates back to the same endpoint.
 * Guidance sourced from `newadvancedconversations.json` snippets.
 */
export default function FeatureFlagsPanel() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/flags')
      .then((r) => r.json())
      .then((json) => {
        setFlags(json.flags || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (name: string, enabled: boolean) => {
    fetch('/flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, enabled }),
    }).then(() => setFlags((prev) => prev.map((f) => (f.name === name ? { ...f, enabled } : f))));
  };

  if (loading) {
    return <div aria-label="FeatureFlagsPanel">Loading...</div>;
  }

  return (
    <div aria-label="FeatureFlagsPanel">
      <ul>
        {flags.map((flag) => (
          <li key={flag.name}>
            <label>
              <input
                aria-label={`flag-${flag.name}`}
                type="checkbox"
                checked={flag.enabled}
                onChange={(e) => toggle(flag.name, e.target.checked)}
              />
              {flag.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
