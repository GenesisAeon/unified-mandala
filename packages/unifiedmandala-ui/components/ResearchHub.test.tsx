import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResearchHub from './ResearchHub';

jest.mock('./FeatureFlagsPanel', () => () => <div aria-label="FeatureFlagsPanel" />);
jest.mock('./AgentControlPanel', () => () => <div aria-label="agent-control-panel" />);

test('renders ResearchHub with child panels', () => {
  render(<ResearchHub />);
  expect(screen.getByLabelText('ResearchHub')).toBeInTheDocument();
  expect(screen.getByLabelText('FeatureFlagsPanel')).toBeInTheDocument();
  expect(screen.getByLabelText('agent-control-panel')).toBeInTheDocument();
});
