import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaDashboard, { ModuleStatus } from './MandalaDashboard';

test('renders module names and statuses', () => {
  const modules: ModuleStatus[] = [
    { name: 'core', status: 'synced' },
    { name: 'ui', status: 'pending' },
  ];
  render(<MandalaDashboard modules={modules} />);
  expect(screen.getByText('core:')).toBeInTheDocument();
  expect(screen.getByText('ui:')).toBeInTheDocument();
  expect(screen.getAllByTestId('sync-status')).toHaveLength(2);
});
