import React, { useEffect, useState } from 'react';
import { Subjects } from '../../event-bus/subjects';

interface Annotation {
  id: string;
  text: string;
  createdAt: number;
}

interface AnnotationsPanelProps {
  docId: string;
  wsUrl?: string;
}

/**
 * AnnotationsPanel shows realtime annotations and provides a form to add new ones.
 * Derived from guidance in `newadvancedconversations.json`.
 */
export default function AnnotationsPanel({ docId, wsUrl = 'ws://localhost:4022' }: AnnotationsPanelProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(`/annotations/${docId}`)
      .then((r) => r.json())
      .then((json) => setAnnotations(json.annotations || []));
  }, [docId]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({ v: '1.0', msg: { type: 'subscribe', channel: Subjects.LIVE_ANSWER } })
      );
    };
    ws.onmessage = (ev) => {
      try {
        const env = JSON.parse(ev.data);
        const msg = env.msg;
        if (msg.type === 'event' && msg.channel === Subjects.LIVE_ANSWER) {
          const { docId: d, annotation } = msg.payload as { docId: string; annotation: Annotation };
          if (d === docId) {
            setAnnotations((prev) => [...prev, annotation]);
          }
        }
      } catch {
        /* ignore malformed messages */
      }
    };
    return () => ws.close();
  }, [docId, wsUrl]);

  const submit = () => {
    const body = JSON.stringify({ text });
    fetch(`/annotations/${docId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then((r) => r.json())
      .then((ann: Annotation) => {
        setAnnotations((prev) => [...prev, ann]);
        setText('');
      });
  };

  return (
    <div aria-label="AnnotationsPanel">
      <ul>
        {annotations.map((a) => (
          <li key={a.id}>{a.text}</li>
        ))}
      </ul>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={submit}>Add</button>
    </div>
  );
}

