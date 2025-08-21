import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemOverview from './SystemOverview';

test('renders service health status', () => {
  const services = [
    { name: 'api', healthy: true },
    { name: 'db', healthy: false },
  ];

  render(<SystemOverview services={services} />);

  expect(screen.getByText('api: 🟢')).toBeInTheDocument();
  expect(screen.getByText('db: 🔴')).toBeInTheDocument();
});

