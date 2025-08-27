import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MacroEditor from './MacroEditor';

describe('MacroEditor', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve('ok')
    });
  });

  test('runs macro via API', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<MacroEditor />);
    fireEvent.change(getByPlaceholderText('Enter macro...'), { target: { value: 'print("hi")' } });
    fireEvent.click(getByText('Run'));
    await findByText('ok');
    expect(fetch).toHaveBeenCalledWith(
      '/macro/run',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
