import React, { useState } from 'react';

interface SymbolFormInputProps {
  onSubmit: (symbol: string) => void;
}

const SymbolFormInput: React.FC<SymbolFormInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
        setValue('');
      }}
    >
      <input aria-label="Symbol" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">OK</button>
    </form>
  );
};

export default SymbolFormInput;
