import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureFlagsPanel from './FeatureFlagsPanel';

test('renders and toggles feature flags', async () => {
  const fetchMock = jest.fn()
    .mockResolvedValueOnce({
      json: async () => ({ flags: [{ name: 'researchHub.enabled', enabled: false }] })
    })
    .mockResolvedValueOnce({});
  // @ts-ignore
  global.fetch = fetchMock;

  render(<FeatureFlagsPanel />);

  await waitFor(() => screen.getByLabelText('flag-researchHub.enabled'));
  const checkbox = screen.getByLabelText('flag-researchHub.enabled') as HTMLInputElement;
  expect(checkbox.checked).toBe(false);
  fireEvent.click(checkbox);
  expect(fetchMock).toHaveBeenLastCalledWith('/flags', expect.any(Object));
});
