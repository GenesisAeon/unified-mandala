import React, { useState } from 'react';

interface SymbolLoginProps {
  onSubmit?: (symbol: string) => void;
}

const SymbolLogin: React.FC<SymbolLoginProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit?.(value); }}>
      <input aria-label="Symbol-Login" value={value} onChange={e => setValue(e.target.value)} />
      <button type="submit">Start</button>
    </form>
  );
};

export default SymbolLogin;
