import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VoicePanel from './VoicePanel';

describe('VoicePanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({ text: async () => 'hello' })
      .mockResolvedValueOnce({ json: async () => ({ text: 'hello world' }) });
  });

  test('renders partial and final results', async () => {
    const { getByText, getByLabelText } = render(<VoicePanel />);

    fireEvent.click(getByText('Fetch Partial'));
    await waitFor(() =>
      expect(getByLabelText('partial-result')).toHaveTextContent('hello')
    );

    fireEvent.click(getByText('Fetch Final'));
    await waitFor(() =>
      expect(getByText('hello world')).toBeInTheDocument()
    );
    expect(getByLabelText('partial-result')).toHaveTextContent('');
  });
});
