import React, { useEffect, useState } from 'react';

interface SigillinData {
  id: string;
  title: string;
  resonanz: string;
  relevanz: string;
  erstellt_am: string;
  kommentare: string[];
}

const SigillinViewer: React.FC<{ url: string }> = ({ url }) => {
  const [data, setData] = useState<SigillinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data: SigillinData) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fehler beim Laden des Sigillins:', error);
        setLoading(false);
      });
  }, [url]);

  if (loading) return <div>Lädt Sigillin-Daten...</div>;
  if (!data) return <div>Keine Sigillin-Daten verfügbar.</div>;

  return (
    <div className="sigillin-viewer">
      <h2>{data.title}</h2>
      <p><strong>ID:</strong> {data.id}</p>
      <p><strong>Resonanz:</strong> {data.resonanz}</p>
      <p><strong>Relevanz:</strong> {data.relevanz}</p>
      <p><strong>Erstellt am:</strong> {new Date(data.erstellt_am).toLocaleDateString()}</p>
      <ul>
        {data.kommentare.map((kommentar, index) => (
          <li key={index}>{kommentar}</li>
        ))}
      </ul>
    </div>
  );
};

export default SigillinViewer;
