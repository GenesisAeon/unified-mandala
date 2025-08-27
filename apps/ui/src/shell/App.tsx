import React, { useEffect, useState } from "react";
type Kpi = { id: string; label: string; threshold?: number; warn?: number; unit?: string };
type ClimateConfig = { kpis: Kpi[] };

export default function App() {
  const [cfg, setCfg] = useState<ClimateConfig | null>(null);
  useEffect(() => {
    fetch("/config/climate-dashboard.yaml")
      .then(res => res.text())
      .then(txt => {
        const kpis = [...txt.matchAll(/^- id:\s*(.*)\s*[\r\n]+.*label:\s*(.*)$/gm)]
          .map(m => ({ id: m[1].trim(), label: m[2].trim() }));
        setCfg({ kpis });
      })
      .catch(() => setCfg({ kpis: [] }));
  }, []);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Mandala Climate Dashboard</h1>
      <p style={{ opacity: 0.7 }}>Wiring-Check: Config → UI</p>
      <h2>KPIs</h2>
      <ul>
        {(cfg?.kpis ?? []).map(k => (
          <li key={k.id}><strong>{k.id}</strong> — {k.label}</li>
        ))}
      </ul>
      {!cfg && <p>Lade Konfiguration …</p>}
    </div>
  );
}
