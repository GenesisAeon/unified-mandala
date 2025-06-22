import React from 'react';
import { useCREP } from '../hooks/useCREP';
import CREPTriggerPanel from './CREPTriggerPanel';
import CREPChart from './CREPChart';

const DEMO_TRIGGERS = [
  { label: 'Low', data: { C: 1, R: 1, E: 1, P: 1 } },
  { label: 'Medium', data: { C: 5, R: 5, E: 5, P: 5 } },
  { label: 'High', data: { C: 9, R: 9, E: 9, P: 9 } },
];

const CREPTestHarness: React.FC = () => {
  const { history } = useCREP();
  return (
    <div aria-label="CREP Test Harness">
      <CREPTriggerPanel availableTriggers={DEMO_TRIGGERS} />
      <CREPChart history={history} />
    </div>
  );
};

export default CREPTestHarness;
