import React from 'react';
import { CREPManager } from '../../crep-engine/CREPManager';
import { useCREPHistory } from '../hooks/useCREPHistory';
import NullmembranSIHeatmap from './NullmembranSIHeatmap';

export interface HeatmapWidgetProps {
  manager?: CREPManager;
  size?: number;
}

export default function HeatmapWidget({ manager = new CREPManager(), size = 20 }: HeatmapWidgetProps) {
  const history = useCREPHistory(manager);
  const values = history.slice(-size).map(h => (h.C + h.R + h.E + h.P) / 4);
  return (
    <div className="heatmap-widget" aria-label="CREP Heatmap">
      <NullmembranSIHeatmap values={values} />
    </div>
  );
}
