import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalEventsPanel from './GlobalEventsPanel';

describe('GlobalEventsPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      json: async () => ({ events: [] }),
    });
  });

  test('fetches events and renders heading', async () => {
    render(<GlobalEventsPanel />);
    expect(fetch).toHaveBeenCalledWith('/global-events');
    expect(await screen.findByText(/Global Events/)).toBeInTheDocument();
  });
});
