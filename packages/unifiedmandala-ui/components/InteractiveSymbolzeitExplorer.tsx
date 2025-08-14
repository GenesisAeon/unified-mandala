import React, { useState } from 'react';

export interface InteractiveSymbolzeitExplorerProps {
  initial?: number;
  onChange?: (value: number) => void;
}

const InteractiveSymbolzeitExplorer: React.FC<InteractiveSymbolzeitExplorerProps> = ({ initial = 0, onChange }) => {
  const [value, setValue] = useState(initial);

  const update = (next: number) => {
    setValue(next);
    onChange?.(next);
  };

  return (
    <div aria-label="symbolzeit-explorer">
      <p>Symbolzeit: {value}</p>
      <button onClick={() => update(value - 1)}>Past</button>
      <button onClick={() => update(value + 1)}>Future</button>
    </div>
  );
};

export default InteractiveSymbolzeitExplorer;
