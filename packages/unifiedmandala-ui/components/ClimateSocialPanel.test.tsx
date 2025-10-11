import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClimateSocialPanel from './ClimateSocialPanel';

describe('ClimateSocialPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      json: async () => ({ temperature: 1, socialIndex: 0.5 }),
    });
  });

  test('fetches data and renders heading', async () => {
    render(<ClimateSocialPanel />);
    expect(fetch).toHaveBeenCalledWith('/process', expect.objectContaining({ method: 'POST' }));
    expect(await screen.findByText(/Climate & Social Metrics/)).toBeInTheDocument();
  });
});
