import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PluginList from './PluginList';

describe('PluginList', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { name: 'mandalaHaiku', version: '1.1.0', approved: false, blacklisted: false },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders plugin names', async () => {
    await act(async () => {
      render(<PluginList />);
    });
    expect(await screen.findByText(/mandalaHaiku/)).toBeInTheDocument();
  });
});
