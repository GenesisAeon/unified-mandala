import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('../../../../packages/unifiedmandala-ui/components/MandalaNetworkView', () => () => (
  <svg aria-label="mock-network" />
));
jest.mock('../../../../packages/unifiedmandala-ui/components/AgentHeatmap', () => () => (
  <div aria-label="mock-heatmap" />
));
import ImpactDashboard from './ImpactDashboard';

test('renders network view and heatmap', () => {
  render(<ImpactDashboard />);
  expect(screen.getByLabelText('Impact Dashboard')).toBeInTheDocument();
});
