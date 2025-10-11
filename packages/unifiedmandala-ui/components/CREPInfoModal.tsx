import React from 'react';

interface CREPInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const descriptions = {
  C: 'Coherence – Klarheit der Verbindungen.',
  R: 'Resonance – Mitschwingen und Kommunikation.',
  E: 'Emergence – Neues entsteht spontan.',
  P: 'Poetics – Tiefere symbolische Bedeutung.',
};

const CREPInfoModal: React.FC<CREPInfoModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="crep-info-modal">
      <h2>CREP-Werte</h2>
      <ul>
        {Object.entries(descriptions).map(([key, text]) => (
          <li key={key}>
            <strong>{key}</strong>: {text}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Schließen</button>
    </div>
  );
};

export default CREPInfoModal;
