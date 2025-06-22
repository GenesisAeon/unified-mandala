import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPTimeline from './CREPTimeline';
import { CREPEntry } from '../../crep-engine/types';

test('renders list of CREP events', () => {
  const events: CREPEntry[] = [
    { timestamp: new Date('2025-06-22T12:00:00Z'), C: 3, R: 4, E: 5, P: 2 },
  ];
  render(<CREPTimeline events={events} />);
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getByText(/C:3/)).toBeInTheDocument();
});
