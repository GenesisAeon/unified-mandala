import React, { useState } from 'react';

const SERVICES = [
  { id: 'gpt4all_chat', label: 'GPT4All (local)' },
  { id: 'openassistant_chat', label: 'OpenAssistant' },
  { id: 'h2ogpt_chat', label: 'H2O GPT' },
  { id: 'simulate_singularity', label: 'Singularity Sim' },
];

export default function ServiceToolbar({ onPick }: { onPick: (id: string) => void }) {
  const [sel, setSel] = useState(SERVICES[0].id);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={sel} onChange={(e) => setSel(e.target.value)}>
        {SERVICES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <button onClick={() => onPick(sel)}>Route</button>
    </div>
  );
}
