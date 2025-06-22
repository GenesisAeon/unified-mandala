import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('../socialgood-ui/src/components/ImpactDashboard', () => () => <div aria-label="mock-impact" />);
import MobileImpactDashboard from './MobileImpactDashboard';

test('renders mobile dashboard', () => {
  render(<MobileImpactDashboard />);
  expect(screen.getByLabelText('Mobile Impact Dashboard')).toBeInTheDocument();
});
