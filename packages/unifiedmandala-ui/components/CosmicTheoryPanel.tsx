import React from 'react';

interface Props {
  formulas: string[];
}

const CosmicTheoryPanel: React.FC<Props> = ({ formulas }) => (
  <div>
    <h3>Cosmic Theories</h3>
    <ul>
      {formulas.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  </div>
);

export default CosmicTheoryPanel;
