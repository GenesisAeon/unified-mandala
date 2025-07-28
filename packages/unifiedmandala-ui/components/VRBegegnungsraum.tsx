import React from 'react';
import { useLatestCREP } from '../hooks/useLatestCREP';

export default function VRBegegnungsraum() {
  const { value, error } = useLatestCREP();
  return (
    <div>
      VR Raum
      {value !== null && <div data-testid="crep-value">CREP: {value}</div>}
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
}
