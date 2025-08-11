import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * GovernanceSimulatorPanel allows interactive experiments with
 * Weltinnenpolitik scenarios. Users can adjust aid investment
 * and simulation time span then visualise resulting GDP trends.
 */
const GovernanceSimulatorPanel: React.FC = () => {
  const [aid, setAid] = useState(1000); // in Mio. USD
  const [years, setYears] = useState(10);
  const [data, setData] = useState<any[]>([]);

  const run = async () => {
    const payload = {
      name: 'Test-Szenario',
      policies: { aid_investment: aid * 1_000_000 },
      years
    };
    const res = await fetch('/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    setData(json.results);
  };

  return (
    <div className="my-4 border p-4 rounded">
      <h3>Weltinnenpolitik-Simulator</h3>
      <div className="space-y-4">
        <div>
          <label>Aid-Investition (Mio USD):</label>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={aid}
            onChange={(e) => setAid(parseInt(e.target.value, 10))}
          />
          <span>{aid} Mio USD</span>
        </div>
        <div>
          <label>Zeithorizont (Jahre):</label>
          <input
            type="number"
            value={years}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYears(parseInt(e.target.value, 10))}
          />
        </div>
        <button onClick={run}>Simulate</button>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="gdp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GovernanceSimulatorPanel;
