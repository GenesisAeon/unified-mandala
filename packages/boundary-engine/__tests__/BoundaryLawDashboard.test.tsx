import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoundaryLawDashboard from '../BoundaryLawDashboard';

test('renders laws and macros', () => {
  render(<BoundaryLawDashboard laws={["law1"]} macroHypotheses={["macro1"]} />);
  expect(screen.getByText('law1')).toBeInTheDocument();
  expect(screen.getByText('macro1')).toBeInTheDocument();
});
