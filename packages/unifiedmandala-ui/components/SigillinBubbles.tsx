import React from 'react';

export interface SigillinBubble {
  id: string;
  label: string;
}

interface Props {
  bubbles: SigillinBubble[];
}

const SigillinBubbles: React.FC<Props> = ({ bubbles }) => (
  <div aria-label="Sigillin Bubbles" style={{ display: 'flex', gap: '0.5rem' }}>
    {bubbles.map((b) => (
      <div
        key={b.id}
        className="bubble"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#acf',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'scale(1)',
          transition: 'transform 0.3s',
        }}
      >
        {b.label}
      </div>
    ))}
  </div>
);

export default SigillinBubbles;
