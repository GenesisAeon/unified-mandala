import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BadgeProfile from './BadgeProfile';

describe('BadgeProfile', () => {
  it('renders badge title and level', () => {
    render(<BadgeProfile title="Explorer" level={2} />);
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<BadgeProfile title="Helper" level={1} icon="⭐" />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });
});

