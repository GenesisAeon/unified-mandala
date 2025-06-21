import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminMetrics from './AdminMetrics';

test('renders admin metrics', () => {
  render(<AdminMetrics avgCREP={0.5} sigillinAdoption={2} openTodos={1} />);
  expect(screen.getByLabelText('Admin Metrics')).toHaveTextContent('0.50');
});
