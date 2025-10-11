import React from 'react';
import CREPTriggerPanel from './CREPTriggerPanel';

export default {
  title: 'UnifiedMandala/CREPTriggerPanel',
  component: CREPTriggerPanel,
};

export const Default = () => (
  <CREPTriggerPanel availableTriggers={[{ label: 'Ping', data: { C: 1, R: 1, E: 1, P: 1 } }]} />
);
