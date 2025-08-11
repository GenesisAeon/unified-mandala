import React from 'react';

interface SentimentBadgeProps {
  /** Sentiment score between -1 (negative) and 1 (positive) */
  score: number;
}

/**
 * Displays a badge representing sentiment based on score.
 */
const SentimentBadge: React.FC<SentimentBadgeProps> = ({ score }) => {
  const label = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
  const color = label === 'positive' ? 'green' : label === 'negative' ? 'red' : 'gray';
  return (
    <span
      data-testid="sentiment-badge"
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        textTransform: 'capitalize',
      }}
    >
      {label}
    </span>
  );
};

export default SentimentBadge;
