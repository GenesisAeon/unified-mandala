import React, { useState } from 'react';
import YAML from 'yaml';

interface SigillinLoaderProps {
  onLoaded?: (data: unknown) => void;
}

const SigillinLoader: React.FC<SigillinLoaderProps> = ({ onLoaded }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const data = file.name.endsWith('.yaml') || file.name.endsWith('.yml')
          ? YAML.parse(text)
          : JSON.parse(text);
        setError(null);
        onLoaded?.(data);
      } catch (err) {
        setError('Fehler beim Laden der Datei');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".json,.yaml,.yml"
        onChange={handleFile}
        aria-label="Sigillin laden"
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
};

export default SigillinLoader;
