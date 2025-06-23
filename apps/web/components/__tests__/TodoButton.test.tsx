import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoButton from '../TodoButton';

const mockFetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ ok: true }) }));
// @ts-ignore
global.fetch = mockFetch;

test('calls endpoint on click', async () => {
  const cb = jest.fn();
  render(<TodoButton onComplete={cb} />);
  fireEvent.click(screen.getByRole('button', { name: /parse todos/i }));
  await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  expect(mockFetch).toHaveBeenCalledWith('/usecases/todo/parse');
  expect(cb).toHaveBeenCalledWith({ ok: true });
});
