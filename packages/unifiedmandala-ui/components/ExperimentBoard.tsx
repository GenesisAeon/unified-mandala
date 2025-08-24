import React, { useEffect, useState } from 'react';

interface Experiment {
  id: string;
  result: string;
}

/**
 * ExperimentBoard compares experiment runs and enforces personhood by
 * sending a required header. It lists each experiment id with its result.
 */
export default function ExperimentBoard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/experiments/list', { headers: { 'X-Personhood': 'required' } })
      .then((r) => r.json())
      .then((json) => {
        setExperiments(json.experiments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div aria-label="ExperimentBoard">Loading...</div>;
  }
  if (experiments.length === 0) {
    return <div aria-label="ExperimentBoard">No experiments</div>;
  }

  return (
    <div aria-label="ExperimentBoard">
      <ul>
        {experiments.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.id}</strong>: {exp.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
