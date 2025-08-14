import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResonanceHistoryPanel, { ResonanceRecord } from './ResonanceHistoryPanel';

test('renders resonance records', () => {
  const records: ResonanceRecord[] = [
    { timestamp: new Date('2025-06-01T00:00:00Z'), crep: 5, volume: 42, drift: 0.1 },
  ];
  render(<ResonanceHistoryPanel records={records} />);
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByText(/42/)).toBeInTheDocument();
});
