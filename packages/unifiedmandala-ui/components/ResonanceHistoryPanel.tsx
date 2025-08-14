import React from 'react';

export interface ResonanceRecord {
  timestamp: Date;
  crep: number;
  volume: number;
  drift: number;
}

export interface ResonanceHistoryPanelProps {
  records: ResonanceRecord[];
}

const ResonanceHistoryPanel: React.FC<ResonanceHistoryPanelProps> = ({ records }) => (
  <table aria-label="Resonance history">
    <thead>
      <tr>
        <th>Time</th>
        <th>CREP</th>
        <th>Volume</th>
        <th>Drift</th>
      </tr>
    </thead>
    <tbody>
      {records.map(r => (
        <tr key={r.timestamp.toString()}>
          <td>{new Date(r.timestamp).toLocaleString()}</td>
          <td>{r.crep}</td>
          <td>{r.volume}</td>
          <td>{r.drift}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResonanceHistoryPanel;
