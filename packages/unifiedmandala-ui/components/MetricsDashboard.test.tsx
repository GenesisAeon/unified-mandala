import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsDashboard from './MetricsDashboard';

jest.mock('../hooks/useMetaScores', () => ({
  useMetaScores: () => [{ layer: 'alpha', score: 0.8 }]
}));

test('renders metrics line chart', () => {
  render(<MetricsDashboard />);
  expect(screen.getByText('alpha')).toBeInTheDocument();
});
