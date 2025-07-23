import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoundaryLawDashboard from '../BoundaryLawDashboard';

describe('BoundaryLawDashboard', () => {
  it('renders provided laws', () => {
    render(<BoundaryLawDashboard laws={["Law A", "Law B"]} />);
    expect(screen.getByText('Boundary Law Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Law A')).toBeInTheDocument();
    expect(screen.getByText('Law B')).toBeInTheDocument();
  });
});
