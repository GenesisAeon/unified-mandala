import React from 'react';

export interface SigilAlertProps {
  message: string;
  onClose?: () => void;
}

const SigilAlert: React.FC<SigilAlertProps> = ({ message, onClose }) => (
  <div role="alert" className="sigil-alert">
    <span>{message}</span>
    {onClose && (
      <button aria-label="close" onClick={onClose}>
        ×
      </button>
    )}
  </div>
);

export default SigilAlert;
