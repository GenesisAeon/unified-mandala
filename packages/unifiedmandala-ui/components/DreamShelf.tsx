import React, { useEffect, useState } from 'react';
import { DreamEntry, DreamMemory } from '../../core/DreamMemory';

export const DreamShelf: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);

  useEffect(() => {
    DreamMemory.load();
    setDreams(DreamMemory.latest());
  }, []);

  return (
    <div className="p-4 bg-blue-900 text-white rounded">
      <h2 className="text-lg mb-2">🌙 Traum-Speicher</h2>
      <ul>
        {dreams.map(d => (
          <li key={d.id} className="mb-1">
            <span className="text-xs opacity-60">{new Date(d.timestamp).toLocaleTimeString()}</span>
            <p className="italic">{d.vision}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
