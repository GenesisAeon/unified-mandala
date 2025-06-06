import React from 'react';

interface InviteBannerProps {
  message: string;
  onJoin: () => void;
}

const InviteBanner: React.FC<InviteBannerProps> = ({ message, onJoin }) => (
  <div role="banner">
    <p>{message}</p>
    <button onClick={onJoin}>Mitmachen</button>
  </div>
);

export default InviteBanner;
