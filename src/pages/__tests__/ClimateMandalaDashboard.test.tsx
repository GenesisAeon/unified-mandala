import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClimateMandalaDashboard from '../ClimateMandalaDashboard';

describe('ClimateMandalaDashboard', () => {
  it('renders heading and geophysik section', () => {
    render(<ClimateMandalaDashboard />);
    expect(screen.getByRole('heading', { name: /Climate Mandala Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText('Geophysik')).toBeInTheDocument();
  });
});
