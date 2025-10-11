import React, { useState } from 'react';

/**
 * NewsBotPanel offers controls for collecting training data and
 * launching fine-tuning jobs for the NewsBot services.
 */
const NewsBotPanel: React.FC = () => {
  const [trainingMode, setTrainingMode] = useState(false);

  const collectTrainingData = async () => {
    await fetch('/training/collect', { method: 'POST' });
  };

  const startFinetune = async () => {
    const payload = {
      base_model: 'vicuna-13b',
      output_dir: '/models/latest',
    };
    await fetch('/finetune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="my-4 border p-4 rounded">
      <h3>NewsBot Training</h3>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={trainingMode}
          onChange={(e) => setTrainingMode(e.target.checked)}
        />{' '}
        Training-Modus aktiv
      </label>
      <div className="space-x-4">
        <button onClick={collectTrainingData} disabled={!trainingMode}>
          Sammle Trainingsdaten
        </button>
        <button onClick={startFinetune} disabled={!trainingMode}>
          Finetune starten
        </button>
      </div>
    </div>
  );
};

export default NewsBotPanel;
