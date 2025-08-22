import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewerHotkeys from './ReviewerHotkeys';

describe('ReviewerHotkeys', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({});
  });

  test('sends approve decision on "A" key', () => {
    render(<ReviewerHotkeys currentId="1" />);
    fireEvent.keyDown(window, { key: 'a' });
    expect(fetch).toHaveBeenCalledWith(
      '/review/decision',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: '1', decision: 'approve' })
      })
    );
  });

  test('sends reject decision on "R" key', () => {
    render(<ReviewerHotkeys currentId="2" />);
    fireEvent.keyDown(window, { key: 'r' });
    expect(fetch).toHaveBeenCalledWith(
      '/review/decision',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: '2', decision: 'reject' })
      })
    );
  });

  test('sends hold decision on "H" key', () => {
    render(<ReviewerHotkeys currentId="3" />);
    fireEvent.keyDown(window, { key: 'h' });
    expect(fetch).toHaveBeenCalledWith(
      '/review/decision',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: '3', decision: 'hold' })
      })
    );
  });
});
