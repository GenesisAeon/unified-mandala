import React from 'react';
import { Tooltip } from 'react-tooltip'; // Annahme: react-tooltip als Abhängigkeit installiert

interface CREPTooltipProps {
  label: string;
  value: number;
}

const CREPTooltip: React.FC<CREPTooltipProps> = ({ label, value }) => {
  const descriptionMap: Record<string, string> = {
    C: 'Coherence – Klarheit der Verbindungen.',
    R: 'Resonance – Mitschwingen und Kommunikation.',
    E: 'Emergence – Neues entsteht spontan.',
    P: 'Poetics – Tiefere symbolische Bedeutung.',
  };

  return (
    <Tooltip content={`${descriptionMap[label]} Wert: ${value.toFixed(2)}`}>
      <span className="crep-label">{label}: {value.toFixed(2)}</span>
    </Tooltip>
  );
};

export default CREPTooltip;