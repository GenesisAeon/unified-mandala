import React from "react";

export default function Era5CrepPanel() {
  // Minimal: liest Score-Datei, wenn per static hosting verfügbar
  // In Produktion: Backend-Endpunkt / Datenservice nutzen
  const [score, setScore] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch("/data/mrv/era5_2m_temperature_202409.score.txt")
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(setScore)
      .catch(() => setScore(null));
  }, []);
  return (
    <div className="card">
      <h3>ERA5 CREP</h3>
      <p>{score ? `Score: ${score}` : "—"}</p>
    </div>
  );
}
