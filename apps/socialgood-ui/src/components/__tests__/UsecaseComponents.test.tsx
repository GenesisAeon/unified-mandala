import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsecaseComponents from '../UsecaseComponents';

const mockFetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
// @ts-ignore
global.fetch = mockFetch;

test('triggers callbacks and fetches', async () => {
  const sigil = jest.fn();
  const todos = jest.fn();
  const match = jest.fn();
  render(<UsecaseComponents onSigil={sigil} onTodos={todos} onMatch={match} />);

  fireEvent.click(screen.getByLabelText('Generate Sigil'));
  fireEvent.click(screen.getByLabelText('Parse TODOs'));
  fireEvent.click(screen.getByLabelText('Match SocialGood'));

  await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3));
  expect(sigil).toHaveBeenCalled();
  expect(todos).toHaveBeenCalled();
  expect(match).toHaveBeenCalled();
});
