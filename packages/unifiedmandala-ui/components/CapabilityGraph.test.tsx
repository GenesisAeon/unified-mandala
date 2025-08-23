import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CapabilityGraph from './CapabilityGraph';

test('renders capability gating information', () => {
  const capabilities = [
    { name: 'write', enabled: true },
    { name: 'delete', enabled: false, gatedBy: ['admin'] },
  ];

  render(<CapabilityGraph capabilities={capabilities} />);

  expect(screen.getByText('write: ✅')).toBeInTheDocument();
  expect(screen.getByText('delete: 🚫 (gated by: admin)')).toBeInTheDocument();
});

