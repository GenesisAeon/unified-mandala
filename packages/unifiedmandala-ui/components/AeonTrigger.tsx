import React from 'react';

interface AeonTriggerProps {
  onActivate: () => void;
}

const AeonTrigger: React.FC<AeonTriggerProps> = ({ onActivate }) => (
  <button onClick={onActivate}>Aeon Trigger</button>
);

export default AeonTrigger;
