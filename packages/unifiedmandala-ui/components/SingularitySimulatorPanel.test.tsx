import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingularitySimulatorPanel from './SingularitySimulatorPanel';

beforeAll(() => {
  (window as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders singularity simulator controls', () => {
  render(<SingularitySimulatorPanel />);
  expect(screen.getByText(/Singularity-Simulator/)).toBeInTheDocument();
  expect(screen.getByText(/Zeithorizont/)).toBeInTheDocument();
  expect(screen.getByText(/Verschmelzungs-Tiefe/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Simulation starten/ })).toBeInTheDocument();
});
