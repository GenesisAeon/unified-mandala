import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenEthikDashboard from './OpenEthikDashboard';

test('renders dashboard title', () => {
  render(<OpenEthikDashboard />);
  expect(screen.getByText(/Open Ethik Dashboard/)).toBeInTheDocument();
});

test('renders provided metrics', () => {
  const metrics = [{ label: 'Transparency', value: 80 }];
  render(<OpenEthikDashboard metrics={metrics} />);
  expect(screen.getByText(/Transparency/)).toHaveTextContent('Transparency: 80');
});
