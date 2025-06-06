import React from 'react';
import { useCREP } from '../hooks/useCREP';
import CREPChart from './CREPChart';
import CREPTriggerPanel from './CREPTriggerPanel';

const DEFAULT_TRIGGERS = [
  { label: 'Low', data: { C: 2, R: 2, E: 2, P: 2 } },
  { label: 'Medium', data: { C: 5, R: 5, E: 5, P: 5 } },
  { label: 'High', data: { C: 8, R: 8, E: 8, P: 8 } },
];

const LiveCREPPanel: React.FC = () => {
  const { history, triggerCREP } = useCREP();
  return (
    <section aria-label="Live CREP Panel">
      <CREPTriggerPanel
        availableTriggers={DEFAULT_TRIGGERS.map(t => ({
          label: t.label,
          data: t.data,
        }))}
      />
      <CREPChart history={history} />
    </section>
  );
};

export default LiveCREPPanel;
