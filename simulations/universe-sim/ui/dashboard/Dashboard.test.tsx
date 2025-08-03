import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from './Dashboard';

test('renders provided metrics', () => {
  render(<Dashboard metrics={{ energy: 42 }} />);
  expect(screen.getByTestId('metric-energy')).toHaveTextContent('energy: 42');
});
