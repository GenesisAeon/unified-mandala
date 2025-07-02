import React, { useState } from 'react';

export function InteractiveSymbolzeitExplorer() {
  const [value, setValue] = useState(0);
  return (
    <div>
      <span data-testid="symbolzeit">{value}</span>
      <button onClick={() => setValue(v => v + 1)}>next</button>
    </div>
  );
}
