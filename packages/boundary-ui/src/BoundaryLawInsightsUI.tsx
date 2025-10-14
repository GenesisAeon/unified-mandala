import * as React from 'react';
import type { BoundaryObservation } from '@mandala/boundary-core';

export type BoundaryLawInsightsProps = {
  laws: BoundaryObservation[];
  onScan?: () => void;
  loading?: boolean;
  error?: string | null;
};

export function BoundaryLawInsightsUI({ laws, onScan, loading, error }: BoundaryLawInsightsProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Boundary · Insights</h2>
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            onClick={onScan}
            className="rounded-xl px-3 py-1.5 bg-slate-900 text-white disabled:opacity-50"
          >
            {loading ? 'Scanning' : 'Scan'}
          </button>
        </div>
      </div>
      {error && <div className="rounded-xl bg-red-50 text-red-700 p-2 text-sm">{error}</div>}
      <div className="rounded-xl border overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Source</th>
              <th className="text-left p-2">Rule</th>
              <th className="text-left p-2">Verdict</th>
              <th className="text-left p-2">Severity</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {laws.map((l, i) => (
              <tr key={i} className="odd:bg-white even:bg-slate-50">
                <td className="p-2 whitespace-nowrap">{new Date(l.ts).toLocaleString()}</td>
                <td className="p-2">{l.source}</td>
                <td className="p-2">{l.ruleId}</td>
                <td className="p-2">{l.verdict}</td>
                <td className="p-2">{l.severity ?? '-'}</td>
                <td className="p-2">{l.details ?? '-'}</td>
              </tr>
            ))}
            {laws.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-slate-500">
                  No laws yet. Click <em>Scan</em> or run the CLI to generate results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BoundaryLawInsightsUI;
