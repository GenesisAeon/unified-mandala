import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BoundaryMatrixVisualizer } from '../BoundaryMatrixVisualizer';

describe('BoundaryMatrixVisualizer', () => {
  it('renders matrix', () => {
    render(<BoundaryMatrixVisualizer />);
    expect(screen.getByText('Boundary Matrix')).toBeInTheDocument();
  });
});
