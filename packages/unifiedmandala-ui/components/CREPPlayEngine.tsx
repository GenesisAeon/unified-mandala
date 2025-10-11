import React, { useState } from 'react';
import { useCREP } from '../hooks/useCREP';

const CREPPlayEngine: React.FC = () => {
  const { triggerCREP } = useCREP();
  const [values, setValues] = useState({ C: 5, R: 5, E: 5, P: 5 });

  const handleChange = (key: 'C' | 'R' | 'E' | 'P') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [key]: Number(e.target.value) });
  };

  const handleSubmit = () => {
    triggerCREP(values);
  };

  return (
    <div aria-label="CREP Play Engine">
      {(['C', 'R', 'E', 'P'] as const).map((key) => (
        <label key={key}>
          {key}:{' '}
          <input type="range" min="0" max="10" value={values[key]} onChange={handleChange(key)} />
        </label>
      ))}
      <button onClick={handleSubmit}>Trigger</button>
    </div>
  );
};

export default CREPPlayEngine;
