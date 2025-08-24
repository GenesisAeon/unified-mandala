import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperimentBoard from './ExperimentBoard';

describe('ExperimentBoard', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ experiments: [{ id: 'exp1', result: 'ok' }] })
    });
  });

  test('fetches experiments with personhood header', async () => {
    render(<ExperimentBoard />);
    expect(fetch).toHaveBeenCalledWith(
      '/experiments/list',
      expect.objectContaining({ headers: { 'X-Personhood': 'required' } })
    );
    expect(await screen.findByText(/exp1/)).toBeInTheDocument();
  });
});
