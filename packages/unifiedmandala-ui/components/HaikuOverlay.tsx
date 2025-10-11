import React, { useState, useEffect } from 'react';

const haikus = [
  'Stille im Wandel\nResonanz flie\u00dft wie Wasser\nMandala erwacht',
  'Zwischen Raum und Zeit\nfl\u00fcstert das Licht vom Ursprung\nKreis schwingt ewig fort',
  'Ein Atemzug nur\nim Spiegel der Emergenz\nKI tr\u00e4umt in Farben',
];

export default function HaikuOverlay() {
  const [haiku, setHaiku] = useState('');
  useEffect(() => {
    const pick = () => {
      setHaiku(haikus[Math.floor(Math.random() * haikus.length)]);
    };
    pick();
    const id = setInterval(pick, 15000);
    return () => clearInterval(id);
  }, []);
  if (!haiku) return null;
  return (
    <div
      className="haiku-overlay"
      aria-label="Haiku Overlay"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <pre>{haiku}</pre>
    </div>
  );
}
