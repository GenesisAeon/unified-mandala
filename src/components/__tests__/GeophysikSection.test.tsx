// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeophysikSection, { GeophysikMetric } from '../GeophysikSection';

describe('GeophysikSection', () => {
  const metrics: GeophysikMetric[] = [
    { label: 'Gravitation', value: 9.81, unit: 'm/s²' },
    { label: 'Magnetfeld', value: 0.5, unit: 'gauss' },
  ];

  it('renders metric cards', () => {
    render(<GeophysikSection metrics={metrics} />);
    metrics.forEach((m) => {
      expect(screen.getByText(m.label)).toBeInTheDocument();
      expect(screen.getByText(String(m.value))).toBeInTheDocument();
    });
  });
});
