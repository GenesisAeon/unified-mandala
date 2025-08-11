import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GovernanceSimulatorPanel from './GovernanceSimulatorPanel';

beforeAll(() => {
  (window as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders simulator controls', () => {
  render(<GovernanceSimulatorPanel />);
  expect(screen.getByText(/Weltinnenpolitik-Simulator/)).toBeInTheDocument();
  expect(screen.getByText(/Aid-Investition/)).toBeInTheDocument();
  expect(screen.getByText(/Zeithorizont/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Simulate/ })).toBeInTheDocument();
});
