import React from 'react';

interface ImpactMetric {
  /** Label describing the metric */
  label: string;
  /** Numeric value for the metric */
  value: number;
}

interface ImpactMapProps {
  /** Collection of societal impact metrics to display */
  metrics: ImpactMetric[];
}

/**
 * Renders a simple list of societal impact metrics.
 * This acts as a placeholder visualizer that can later be
 * extended into a full chart or map.
 */
const ImpactMap: React.FC<ImpactMapProps> = ({ metrics }) => {
  return (
    <ul data-testid="impact-map">
      {metrics.map((m) => (
        <li key={m.label}>
          {m.label}: {m.value}
        </li>
      ))}
    </ul>
  );
};

export default ImpactMap;
