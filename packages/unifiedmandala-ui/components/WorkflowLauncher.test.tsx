import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkflowLauncher from './WorkflowLauncher';

test('triggers workflow via POST', async () => {
  const fetchMock = jest.fn().mockResolvedValue({ ok: true });
  // @ts-ignore
  global.fetch = fetchMock;
  render(<WorkflowLauncher endpoint="/api/test" />);
  const btn = screen.getByLabelText('launch-workflow');
  fireEvent.click(btn);
  expect(fetchMock).toHaveBeenCalledWith('/api/test', { method: 'POST' });
  expect(btn).toBeDisabled();
  await waitFor(() => expect(btn).not.toBeDisabled());
});
