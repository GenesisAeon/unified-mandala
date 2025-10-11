import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TwinMonitor from './TwinMonitor';

describe('TwinMonitor', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      json: async () => ({ status: 'ok' }),
    });
  });

  test('fetches status and renders heading', async () => {
    render(<TwinMonitor />);
    expect(fetch).toHaveBeenCalledWith('/digital-twin/status');
    expect(await screen.findByText(/Digital Twin Bridge Status/)).toBeInTheDocument();
  });
});
