import React, { useState } from 'react';

/**
 * VoicePanel displays partial and final speech-to-text results.
 * It exposes simple buttons that fetch mocked endpoints for
 * partial transcripts and final transcripts. Partial results
 * show the most recent recognition fragment while final results
 * accumulate in a list.
 */
export default function VoicePanel() {
  const [partial, setPartial] = useState('');
  const [final, setFinal] = useState<string[]>([]);

  const fetchPartial = async () => {
    const res = await fetch('/voice/partial');
    const text = await res.text();
    setPartial(text);
  };

  const fetchFinal = async () => {
    const res = await fetch('/voice/final');
    const { text } = await res.json();
    setFinal((prev) => [...prev, text]);
    setPartial('');
  };

  return (
    <div>
      <button onClick={fetchPartial}>Fetch Partial</button>
      <button onClick={fetchFinal}>Fetch Final</button>
      <div aria-label="partial-result">{partial}</div>
      <ul>
        {final.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
