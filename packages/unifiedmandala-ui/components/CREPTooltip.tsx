import React from 'react';

interface CREPTooltipProps {
  value: number;
  label?: string;
  children?: React.ReactNode;
}

/**
 * Small info overlay to display a CREP value.
 */
const CREPTooltip: React.FC<CREPTooltipProps> = ({ value, label = 'ℹ️', children }) => {
  const content = children || label;
  return (
    <span data-testid="crep-tooltip" title={`CREP value: ${value}`}>
      {content}
    </span>
  );
};

export default CREPTooltip;
