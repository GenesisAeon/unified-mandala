import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SyncStatus from './SyncStatus';

test('shows status text', () => {
  render(<SyncStatus status="pending" />);
  expect(screen.getByTestId('sync-status')).toHaveTextContent('pending');
});
