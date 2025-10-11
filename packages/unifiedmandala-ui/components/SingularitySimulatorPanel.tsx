import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * SingularitySimulatorPanel allows interactive simulations of
 * intelligence growth depending on merge depth between humans and AI.
 */
const SingularitySimulatorPanel: React.FC = () => {
  const [years, setYears] = useState(10);
  const [mergeDepth, setMergeDepth] = useState(0.5);
  const [data, setData] = useState<any[]>([]);

  const run = async () => {
    const payload = {
      name: 'Standard-Szenario',
      timeline_years: years,
      merge_depth: mergeDepth,
    };
    const res = await fetch('/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setData(json.results);
  };

  return (
    <div className="my-4 border p-4 rounded">
      <h3>Singularity-Simulator</h3>
      <div className="space-y-4">
        <div>
          <label>Zeithorizont (Jahre): {years}</label>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label>Verschmelzungs-Tiefe: {Math.round(mergeDepth * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={mergeDepth}
            onChange={(e) => setMergeDepth(parseFloat(e.target.value))}
          />
        </div>
        <button onClick={run}>Simulation starten</button>
        {data.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="year"
                  label={{ value: 'Jahr', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Intelligenz-Faktor', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line dataKey="raw_intelligence" name="Basis-Intelligenz" dot={false} />
                <Line
                  dataKey="effective_intelligence"
                  name="Effektive Intelligenz"
                  dot={false}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingularitySimulatorPanel;
