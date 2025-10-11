import React, { useState } from 'react';
import { objectiveToLayout } from '../../../services/objective2ui';

const ObjectiveLayoutSuggester: React.FC = () => {
  const [objective, setObjective] = useState('');
  const [layout, setLayout] = useState('');

  const generate = async () => {
    if (!objective) return;
    try {
      const yaml = await objectiveToLayout(objective);
      setLayout(yaml);
    } catch {
      setLayout('');
    }
  };

  return (
    <div>
      <textarea
        aria-label="objective-input"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
      />
      <button onClick={generate}>Generate Layout</button>
      {layout && <pre aria-label="layout-output">{layout}</pre>}
    </div>
  );
};

export default ObjectiveLayoutSuggester;
