import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OSControlPanel from './OSControlPanel';

describe('OSControlPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({});
  });

  test('grants consent then triggers action', async () => {
    const { getByText } = render(<OSControlPanel />);
    fireEvent.click(getByText('Grant Consent'));
    await waitFor(() =>
      expect(fetch).toHaveBeenNthCalledWith(1, '/os/consent', { method: 'POST' })
    );
    fireEvent.click(getByText('Trigger Action'));
    await waitFor(() =>
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        '/os/action',
        expect.objectContaining({ method: 'POST' })
      )
    );
  });
});
