import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentControlPanel from './AgentControlPanel';

test('allows switching between local and external backends', () => {
  const handleChange = jest.fn();
  render(<AgentControlPanel onBackendChange={handleChange} />);

  const localButton = screen.getByLabelText('select-local');
  const externalButton = screen.getByLabelText('select-external');

  // default backend is local
  expect(localButton).toBeDisabled();
  expect(externalButton).not.toBeDisabled();

  fireEvent.click(externalButton);
  expect(handleChange).toHaveBeenCalledWith('external');
  expect(externalButton).toBeDisabled();
  expect(localButton).not.toBeDisabled();
});
