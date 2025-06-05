import React, { useState } from 'react';
import nodes from '../data/sigillin_nodes.json';

interface Node {
  id: string;
  label: string;
  crep: { C: number; R: number; E: number; P: number };
  type: string;
  status: string;
  poetry?: string;
}

const colorForCREP = ({ C, R, E, P }: Node['crep']) => {
  const val = (C + R + E + P) / 40;
  const hue = Math.floor(val * 360);
  return `hsl(${hue},70%,50%)`;
};

export const SigillinLoader: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const types = Array.from(new Set((nodes as Node[]).map(n => n.type)));
  const filtered = (nodes as Node[]).filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="space-y-2" aria-label="SigillinLoader">
      <label>
        Filter Typ:
        <select value={filter} onChange={e => setFilter(e.target.value)} className="ml-2 border p-1 rounded">
          <option value="all">Alle</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <ul>
        {filtered.map(n => (
          <li key={n.id} className="p-1" style={{ backgroundColor: colorForCREP(n.crep) }}>
            {n.label} – {n.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SigillinLoader;
