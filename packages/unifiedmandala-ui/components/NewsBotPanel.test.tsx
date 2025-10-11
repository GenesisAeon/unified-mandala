import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsBotPanel from './NewsBotPanel';

describe('NewsBotPanel', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({ json: async () => ({}) });
  });

  test('renders training controls and triggers endpoints', async () => {
    render(<NewsBotPanel />);
    expect(screen.getByText(/NewsBot Training/)).toBeInTheDocument();
    const toggle = screen.getByLabelText(/Training-Modus aktiv/);
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('button', { name: /Sammle Trainingsdaten/ }));
    expect(fetch).toHaveBeenCalledWith('/training/collect', { method: 'POST' });
    fireEvent.click(screen.getByRole('button', { name: /Finetune starten/ }));
    expect(fetch).toHaveBeenCalledWith('/finetune', expect.objectContaining({ method: 'POST' }));
  });
});
