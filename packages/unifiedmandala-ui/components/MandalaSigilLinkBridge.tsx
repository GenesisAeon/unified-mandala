import React, { useEffect, useState } from 'react';
import SigilSearchPanel from './SigilSearchPanel';

/**
 * MandalaSigilLinkBridge listens for `mandala-sigil-click` events and
 * forwards the clicked sigil id to the SigilSearchPanel.
 */
export default function MandalaSigilLinkBridge() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === 'string') setQuery(detail);
    };
    window.addEventListener('mandala-sigil-click', handler as EventListener);
    return () => window.removeEventListener('mandala-sigil-click', handler as EventListener);
  }, []);

  return (
    <div aria-label="MandalaSigilLinkBridge">
      {query && <SigilSearchPanel initialQuery={query} />}
    </div>
  );
}
