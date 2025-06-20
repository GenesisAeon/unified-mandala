import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentHeatmap from './AgentHeatmap';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

test('renders incoming agent events', () => {
  render(<AgentHeatmap />);
  act(() => {
    GPTEventHub.emit('agentActivity', { id: 'AgentY', timestamp: 'now' });
  });
  expect(screen.getByText('AgentY')).toBeInTheDocument();
});
