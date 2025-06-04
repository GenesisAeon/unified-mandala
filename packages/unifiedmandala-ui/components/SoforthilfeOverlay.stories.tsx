import React from 'react';
import SoforthilfeOverlay from './SoforthilfeOverlay';

export default {
  title: 'UnifiedMandala/SoforthilfeOverlay',
  component: SoforthilfeOverlay,
};

export const Aktiv = () => (
  <SoforthilfeOverlay triggerCondition={true} onResolve={() => alert('Ok!')} />
);

