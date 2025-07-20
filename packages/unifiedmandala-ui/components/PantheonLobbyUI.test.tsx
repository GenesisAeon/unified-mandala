import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PantheonLobbyUI from './PantheonLobbyUI';

test('renders Pantheon lobby', () => {
  render(<PantheonLobbyUI />);
  expect(screen.getByText('Pantheon Lobby')).toBeInTheDocument();
});
