import React from 'react';
import MandalaNetworkView from '../../../../packages/unifiedmandala-ui/components/MandalaNetworkView';
import AgentHeatmap from '../../../../packages/unifiedmandala-ui/components/AgentHeatmap';

const ImpactDashboard: React.FC = () => (
  <section aria-label="Impact Dashboard">
    <MandalaNetworkView />
    <AgentHeatmap />
  </section>
);

export default ImpactDashboard;
