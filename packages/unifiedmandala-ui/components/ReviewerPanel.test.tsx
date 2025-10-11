import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewerPanel from './ReviewerPanel';

describe('ReviewerPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ items: [{ id: '1', text: 'Test' }] }) })
      .mockResolvedValueOnce({});
  });

  test('loads items and sends decision', async () => {
    render(<ReviewerPanel />);
    expect(fetch).toHaveBeenCalledWith('/review/items');
    const approve = await screen.findByText('Approve');
    fireEvent.click(approve);
    expect(fetch).toHaveBeenCalledWith(
      '/review/decision',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
