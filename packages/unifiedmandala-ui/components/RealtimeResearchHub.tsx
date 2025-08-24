import React, { useEffect, useState } from 'react';

/**
 * RealtimeResearchHub streams retrieval hits and answers from the realtime API.
 * It listens to `/realtime/stream` using Server-Sent Events.
 */
export default function RealtimeResearchHub() {
  const [hits, setHits] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const es = new EventSource('/realtime/stream');
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'hit') {
          setHits((h) => [...h, msg.data]);
        } else if (msg.type === 'answer') {
          setAnswers((a) => [...a, msg.data]);
        }
      } catch {
        /* noop */
      }
    };
    return () => es.close();
  }, []);

  return (
    <div aria-label="RealtimeResearchHub">
      <h3>Hits</h3>
      <ul>
        {hits.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <h3>Answers</h3>
      <ul>
        {answers.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
