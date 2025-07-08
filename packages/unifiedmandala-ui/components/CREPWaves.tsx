import React from 'react';
import { CREPEntry } from '../../crep-engine/types';

interface Props {
  history: CREPEntry[];
}

const CREPWaves: React.FC<Props> = ({ history }) => {
  const path = history
    .map((e, idx) => {
      const x = idx * 10;
      const y = 50 - e.C * 5;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg width={history.length * 10} height={60} aria-label="CREP Waves">
      <path d={path} stroke="#8884d8" fill="none" />
    </svg>
  );
};

export default CREPWaves;
