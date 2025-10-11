import React, { useState } from 'react';

/**
 * MacroEditor allows typing automation macros and executing them via HTTP.
 * It posts the macro source to `/macro/run` and renders the response.
 */
export default function MacroEditor() {
  const [source, setSource] = useState('');
  const [output, setOutput] = useState<string | null>(null);

  const run = () => {
    fetch('/macro/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
    })
      .then((r) => r.text())
      .then((text) => setOutput(text))
      .catch(() => setOutput('error'));
  };

  return (
    <div aria-label="MacroEditor">
      <textarea
        placeholder="Enter macro..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <button onClick={run}>Run</button>
      {output && <pre>{output}</pre>}
    </div>
  );
}
