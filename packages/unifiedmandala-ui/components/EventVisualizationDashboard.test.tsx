import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventVisualizationDashboard from './EventVisualizationDashboard';

test('renders counts per event type', () => {
  const events = [
    { type: 'start' },
    { type: 'stop' },
    { type: 'start' },
  ];
  render(<EventVisualizationDashboard events={events} />);
  expect(screen.getByLabelText('event-visualization-dashboard')).toBeInTheDocument();
  expect(screen.getByText('start: 2')).toBeInTheDocument();
  expect(screen.getByText('stop: 1')).toBeInTheDocument();
});
