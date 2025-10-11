import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScreenCapturePanel from './ScreenCapturePanel';

describe('ScreenCapturePanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      blob: async () => new Blob(['fake'], { type: 'image/png' }),
    });
    (global as any).URL.createObjectURL = jest.fn(() => 'blob:test');
  });

  test('requests screenshot and displays image', async () => {
    const { getByText, getByAltText } = render(<ScreenCapturePanel />);
    fireEvent.click(getByText('Capture Screen'));
    await waitFor(() => expect(getByAltText('Screen capture')).toBeInTheDocument());
  });
});
