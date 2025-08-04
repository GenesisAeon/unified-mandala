import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaDashboard, { ModuleStatus } from './MandalaDashboard';

test('renders module names, statuses and conversation stats', () => {
  const modules: ModuleStatus[] = [
    { name: 'core', status: 'synced' },
    { name: 'ui', status: 'pending' },
  ];
  const stats = { conversationCount: 2, messageCount: 5 };
  render(<MandalaDashboard modules={modules} conversationStats={stats} />);
  expect(screen.getByText('core:')).toBeInTheDocument();
  expect(screen.getByText('ui:')).toBeInTheDocument();
  expect(screen.getAllByTestId('sync-status')).toHaveLength(2);
  expect(screen.getByLabelText('Conversation Stats')).toBeInTheDocument();
  expect(screen.getByText('Total Conversations:')).toBeInTheDocument();
  expect(screen.getByText('Total Messages:')).toBeInTheDocument();
});
