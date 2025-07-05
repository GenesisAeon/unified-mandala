import React from 'react';

interface SigilCardProps {
  sigil: string;
  description: string;
}

const SigilCard: React.FC<SigilCardProps> = ({ sigil, description }) => (
  <div className="sigil-card" aria-label="SigilCard">
    <h3>{sigil}</h3>
    <p>{description}</p>
  </div>
);

export default SigilCard;
