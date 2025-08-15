import React from 'react';

/** Describes a catalyst spark emergence entry */
export interface CatalystSpark {
  /** Description of the catalyst spark */
  description: string;
  /** Intensity of the spark on a 0-1 scale */
  intensity: number;
}

interface EmergencePanelProps {
  /** List of catalyst sparks to render */
  sparks: CatalystSpark[];
}

/**
 * Displays catalyst spark emergence data in a simple list.
 * Acts as a placeholder for future, richer visualizations.
 */
const EmergencePanel: React.FC<EmergencePanelProps> = ({ sparks }) => {
  return (
    <div data-testid="emergence-panel">
      <h3>Emergence</h3>
      <ul>
        {sparks.map((spark, idx) => (
          <li key={idx}>
            {spark.description} – {(spark.intensity * 100).toFixed(0)}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencePanel;
