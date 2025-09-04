import React, { useEffect, useRef, useState } from 'react';
import * as Automerge from '@automerge/automerge';

interface Doc {
  text: string;
}

/**
 * CoauthorCanvas provides a minimal collaborative text editor.
 * It syncs document changes through a simple Automerge-based
 * WebSocket protocol compatible with the `collab-ws` script.
 */
export default function CoauthorCanvas({ docId = 'default' }: { docId?: string }) {
  const [value, setValue] = useState('');
  const docRef = useRef(Automerge.init<Doc>());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/collab`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data.toString());
        if (msg.id !== docId) return;
        const [updated] = Automerge.applyChanges(docRef.current, msg.changes);
        docRef.current = updated;
        setValue(updated.text || '');
      } catch {
        /* ignore malformed messages */
      }
    };
    return () => {
      ws.close();
    };
  }, [docId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newText = e.target.value;
    const newDoc = Automerge.change(docRef.current, (d) => {
      d.text = newText;
    });
    const changes = Automerge.getChanges(docRef.current, newDoc);
    docRef.current = newDoc;
    setValue(newText);
    wsRef.current?.send(JSON.stringify({ id: docId, changes }));
  }

  return (
    <div aria-label="CoauthorCanvas">
      <h2>Coauthor Canvas</h2>
      <textarea
        aria-label="coauthor-editor"
        value={value}
        onChange={handleChange}
        rows={10}
        cols={40}
      />
    </div>
  );
}
