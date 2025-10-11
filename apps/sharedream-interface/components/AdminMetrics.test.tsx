import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminMetrics from './AdminMetrics';

test('renders admin metrics with gpt-5 badge', () => {
  render(
    <AdminMetrics
      avgCREP={0.5}
      sigillinAdoption={2}
      openTodos={1}
      gpt5AvgLatency={200}
      gpt5SuccessRate={0.99}
    />,
  );
  const metrics = screen.getByLabelText('Admin Metrics');
  expect(metrics).toHaveTextContent('0.50');
  expect(metrics).toHaveTextContent('GPT-5');
});
