import { render, screen } from '@testing-library/react';
import React from 'react';
import { ResonanceControlPanel } from '../ResonanceControlPanel';

describe('ResonanceControlPanel', () => {
  it('shows level', () => {
    render(<ResonanceControlPanel level={5} />);
    expect(screen.getByText(/Resonance Level: 5/)).toBeInTheDocument();
  });
});
