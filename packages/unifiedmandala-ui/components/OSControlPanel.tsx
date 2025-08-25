import React, { useState } from 'react';

/**
 * OSControlPanel provides a tiny consent gate and action trigger
 * for the Windows OS Bridge. Inspired by guidance in
 * `newadvancedconversations.json`.
 */
export default function OSControlPanel() {
  const [consent, setConsent] = useState(false);

  const grantConsent = async () => {
    await fetch('/os/consent', { method: 'POST' });
    setConsent(true);
  };

  const triggerAction = () => {
    fetch('/os/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'open-notepad' })
    });
  };

  return (
    <div>
      <button onClick={grantConsent} disabled={consent}>
        Grant Consent
      </button>
      <button onClick={triggerAction} disabled={!consent}>
        Trigger Action
      </button>
    </div>
  );
}
