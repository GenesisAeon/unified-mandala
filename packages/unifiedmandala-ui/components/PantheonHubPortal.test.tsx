import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PantheonHubPortal from './PantheonHubPortal';

test('renders Pantheon hub', () => {
  render(<PantheonHubPortal />);
  expect(screen.getByText('Pantheon Hub Portal')).toBeInTheDocument();
});
