import React, { useState } from 'react';
import { SigilManager, SigilEntry } from '../../shared-utils/SigilManager';

interface SigilCrudPanelProps {
  manager: SigilManager;
}

const SigilCrudPanel: React.FC<SigilCrudPanelProps> = ({ manager }) => {
  const [id, setId] = useState('');
  const [content, setContent] = useState('');
  const [sigils, setSigils] = useState<SigilEntry[]>(manager.list());

  const addSigil = () => {
    if (!id) return;
    manager.loadFromString(id, content || '{}');
    setSigils(manager.list());
    setId('');
    setContent('');
  };

  const removeSigil = (sid: string) => {
    manager.remove(sid);
    setSigils(manager.list());
  };

  return (
    <div>
      <input
        aria-label="Sigil ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Sigil ID"
      />
      <textarea
        aria-label="Sigil Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="JSON or YAML"
      />
      <button onClick={addSigil}>Add</button>
      <ul>
        {sigils.map((s) => (
          <li key={s.id}>
            {s.id}
            <button onClick={() => removeSigil(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SigilCrudPanel;
