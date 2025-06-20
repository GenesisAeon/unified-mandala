import React from 'react';

interface ResonanzfeldProps {
  message: string;
}

const Resonanzfeld: React.FC<ResonanzfeldProps> = ({ message }) => (
  <div aria-label="Resonanzfeld">{message}</div>
);

export default Resonanzfeld;
