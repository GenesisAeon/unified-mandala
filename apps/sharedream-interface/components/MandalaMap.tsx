import React, { useMemo } from 'react';
import MandalaMapCanvas, {
  MandalaEdge,
  MandalaNode,
} from '../../../packages/unifiedmandala-ui/components/MandalaMap';

const fallbackNodes: MandalaNode[] = [
  { id: 'core', x: 300, y: 200, label: 'Core Runtime' },
  { id: 'agents', x: 160, y: 90, label: 'Agents' },
  { id: 'governance', x: 460, y: 90, label: 'Governance' },
  { id: 'observability', x: 520, y: 260, label: 'Observability' },
  { id: 'automation', x: 300, y: 340, label: 'Automation' },
  { id: 'testing', x: 110, y: 280, label: 'Testing' },
];

const fallbackEdges: MandalaEdge[] = [
  { id: 'edge-core-agents', source: 'core', target: 'agents' },
  { id: 'edge-agents-governance', source: 'agents', target: 'governance' },
  { id: 'edge-governance-observability', source: 'governance', target: 'observability' },
  { id: 'edge-observability-automation', source: 'observability', target: 'automation' },
  { id: 'edge-automation-testing', source: 'automation', target: 'testing' },
  { id: 'edge-testing-core', source: 'testing', target: 'core' },
];

const MandalaMap: React.FC = () => {
  const nodes = useMemo(() => fallbackNodes, []);
  const edges = useMemo(() => fallbackEdges, []);

  return (
    <MandalaMapCanvas
      nodes={nodes}
      edges={edges}
      enableLegacy
      showLabels
      highlightOnHover
      edgeOpacity={0.45}
    />
  );
};

export default MandalaMap;
