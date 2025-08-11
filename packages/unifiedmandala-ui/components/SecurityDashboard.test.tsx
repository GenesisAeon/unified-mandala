import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard from './SecurityDashboard';

test('renders vulnerabilities', () => {
  const vulnerabilities: { id: string; description: string; severity: 'high' | 'medium' | 'low' }[] = [
    { id: '1', description: 'SQL injection', severity: 'high' },
    { id: '2', description: 'XSS issue', severity: 'medium' }
  ];
  render(<SecurityDashboard vulnerabilities={vulnerabilities} />);
  expect(screen.getByText(/SQL injection/)).toBeInTheDocument();
  expect(screen.getByText(/XSS issue/)).toBeInTheDocument();
  expect(screen.getByText(/HIGH/)).toBeInTheDocument();
});
