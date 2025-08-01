import React, { useState } from 'react';

export interface LeereButtonProps {
  onToggle?: (visible: boolean) => void;
}

const LeereButton: React.FC<LeereButtonProps> = ({ onToggle }) => {
  const [visible, setVisible] = useState(false);
  const toggle = () => {
    const next = !visible;
    setVisible(next);
    onToggle?.(next);
  };
  return (
    <button aria-label="toggle-number-sequence" onClick={toggle}>
      {visible ? 'Nummern ausblenden' : 'Nummern anzeigen'}
    </button>
  );
};

export default LeereButton;
