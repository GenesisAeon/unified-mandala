import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaInterface from './MandalaInterface';

describe('MandalaInterface', () => {
  it('renders title and canvas', () => {
    render(<MandalaInterface title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByLabelText('mandala-canvas')).toBeInTheDocument();
  });
});
