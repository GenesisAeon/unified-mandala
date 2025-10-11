import React from 'react';
import { CREPProvider, useCREPContext } from '../contexts/CREPContext';
import { useAdaptiveLayout } from './useAdaptiveLayout';

const Demo: React.FC = () => {
  const { triggerCREP } = useCREPContext();
  const layout = useAdaptiveLayout();
  return (
    <div style={{ display: 'grid', ...layout }}>
      <div style={{ gridArea: 'header' }}>Header</div>
      <div style={{ gridArea: 'main' }}>Main</div>
      {layout.gridTemplateAreas.includes('sidebar') && (
        <div style={{ gridArea: 'sidebar' }}>Sidebar</div>
      )}
      {layout.gridTemplateAreas.includes('alert') && <div style={{ gridArea: 'alert' }}>Alert</div>}
      <button onClick={() => triggerCREP({ C: 2, R: 2, E: 2, P: 1 })}>Critical</button>
      <button onClick={() => triggerCREP({ C: 5, R: 5, E: 5, P: 1 })}>Warning</button>
      <button onClick={() => triggerCREP({ C: 8, R: 8, E: 8, P: 1 })}>Safe</button>
    </div>
  );
};

export default {
  title: 'Hooks/useAdaptiveLayout',
  component: Demo,
};

export const Example = () => (
  <CREPProvider>
    <Demo />
  </CREPProvider>
);
