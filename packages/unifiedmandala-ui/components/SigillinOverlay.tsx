import React from 'react';

interface SigillinOverlayProps {
  visible: boolean;
}

const SigillinOverlay: React.FC<SigillinOverlayProps> = ({ visible }) => {
  if (!visible) return null;
  return <div className="sigillin-overlay">SigillinOverlay</div>;
};

export default SigillinOverlay;
