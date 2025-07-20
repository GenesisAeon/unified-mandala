import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoundaryLawVisualizer from './BoundaryLawVisualizer';

test('renders boundary laws', () => {
  render(<BoundaryLawVisualizer laws={["law1"]} />);
  expect(screen.getByText('law1')).toBeInTheDocument();
});
