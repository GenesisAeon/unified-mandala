import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaFlowDashboard from './MandalaFlowDashboard';

test('renders flow steps', () => {
  render(<MandalaFlowDashboard steps={['a', 'b']} />);
  expect(screen.getByLabelText('Mandala Flow Dashboard')).toBeInTheDocument();
  expect(screen.getByText('a')).toBeInTheDocument();
});
