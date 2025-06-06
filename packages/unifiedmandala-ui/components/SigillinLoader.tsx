import React, { useState } from 'react';
import YAML from 'yaml';

interface SigillinLoaderProps {
  onLoaded?: (data: unknown) => void;
}

const SigillinLoader: React.FC<SigillinLoaderProps> = ({ onLoaded }) => {
  const [error, setError] = useState<string | null>(null);
<<<<<<< Updated upstream
=======
  const [filter, setFilter] = useState('');
  const [data, setData] = useState<any[]>([]);
>>>>>>> Stashed changes

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
<<<<<<< Updated upstream
        const data = file.name.endsWith('.yaml') || file.name.endsWith('.yml')
          ? YAML.parse(text)
          : JSON.parse(text);
        setError(null);
        onLoaded?.(data);
=======
        const parsed = file.name.endsWith('.yaml') || file.name.endsWith('.yml')
          ? YAML.parse(text)
          : JSON.parse(text);
        setData(Array.isArray(parsed) ? parsed : [parsed]);
        setError(null);
        onLoaded?.(parsed);
>>>>>>> Stashed changes
      } catch (err) {
        setError('Fehler beim Laden der Datei');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

<<<<<<< Updated upstream
=======
  const filtered = data.filter(item =>
    filter ? JSON.stringify(item).toLowerCase().includes(filter.toLowerCase()) : true
  );

>>>>>>> Stashed changes
  return (
    <div>
      <input
        type="file"
        accept=".json,.yaml,.yml"
        onChange={handleFile}
        aria-label="Sigillin laden"
      />
<<<<<<< Updated upstream
      {error && <p role="alert">{error}</p>}
=======
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        aria-label="Filter"
      />
      {error && <p role="alert">{error}</p>}
      <pre>{filtered.length} Einträge geladen</pre>
>>>>>>> Stashed changes
    </div>
  );
};

export default SigillinLoader;
