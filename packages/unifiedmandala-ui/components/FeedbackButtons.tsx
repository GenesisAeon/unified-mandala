import React from 'react';
import { AeonSigillinVault } from '../../core/AeonSigillinVault';

interface Props {
  sigilId: string;
}

const FeedbackButtons: React.FC<Props> = ({ sigilId }) => {
  const record = (type: 'like' | 'dislike') => {
    AeonSigillinVault.record({
      id: `${sigilId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: type,
    });
  };

  return (
    <div>
      <button aria-label="like" onClick={() => record('like')}>
        👍
      </button>
      <button aria-label="dislike" onClick={() => record('dislike')}>
        👎
      </button>
    </div>
  );
};

export default FeedbackButtons;
