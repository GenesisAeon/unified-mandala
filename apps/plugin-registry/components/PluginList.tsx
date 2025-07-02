import React, { useEffect, useState } from 'react';

interface PluginInfo {
  name: string;
  version: string;
  approved: boolean;
  blacklisted: boolean;
  versionLock?: string | null;
}

export default function PluginList() {
  const [plugins, setPlugins] = useState<PluginInfo[]>([]);

  const fetchPlugins = () => {
    fetch('/api/plugins')
      .then((res) => res.json())
      .then(setPlugins);
  };

  useEffect(fetchPlugins, []);

  const act = (url: string, name: string, body: any = {}) => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...body }),
    }).then(fetchPlugins);
  };

  return (
    <div>
      <h2>Plugin Registry</h2>
      <ul>
        {plugins.map((p) => (
          <li key={p.name}>
            {p.name} ({p.version}){' '}
            {p.approved ? '✅' : ''}
            {p.blacklisted ? '🚫' : ''}
            {p.versionLock ? `🔒 ${p.versionLock}` : ''}
            <button onClick={() => act('/api/approve', p.name)}>Approve</button>
            <button onClick={() => act('/api/blacklist', p.name)}>Blacklist</button>
            <button
              onClick={() => {
                const v = prompt('Lock to version', p.version);
                if (v) act('/api/lock-version', p.name, { version: v });
              }}
            >
              Lock Version
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
