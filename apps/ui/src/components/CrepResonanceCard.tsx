import React from "react";
import { useCrepResonance } from "../hooks/useCrepResonance";

const badgeColor: Record<string, string> = {
  green: "#22c55e",
  amber: "#f59e0b",
  red:   "#ef4444"
};

export default function CrepResonanceCard() {
  const { data, loading, error, refetch } = useCrepResonance(8000);

  if (loading) return <div className="card">CREP Resonance: loading…</div>;
  if (error)   return <div className="card">CREP Resonance: error – {error}</div>;
  if (!data)   return <div className="card">CREP Resonance: no data</div>;

  const color = badgeColor[data.level] || "#999";
  const entropy = data.entropy.toFixed(2);

  return (
    <div className="card" style={{
      border: "1px solid #eee", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          display: "inline-block", width: 14, height: 14, borderRadius: 14, background: color
        }} />
        <strong>CREP Resonance</strong>
      </div>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        <div>Level: <b>{data.level.toUpperCase()}</b></div>
        <div>Entropy: <code>{entropy}</code></div>
        <div>n: <code>{data.n}</code> • source: <code>{data.source}</code></div>
        <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{new Date(data.ts).toLocaleString()}</div>
      </div>
      <button onClick={refetch} style={{ marginTop: 12, padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa" }}>
        Refresh
      </button>
    </div>
  );
}
