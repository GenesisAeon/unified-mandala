import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventStreamPanel from './EventStreamPanel';

test('renders provided events', () => {
  const events = [{ type: 'a' }, { type: 'b' }];
  render(<EventStreamPanel events={events} />);
  expect(screen.getByLabelText('event-stream-panel')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText(/"type":"a"/)).toBeInTheDocument();
});
