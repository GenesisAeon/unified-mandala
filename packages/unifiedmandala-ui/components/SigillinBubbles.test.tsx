import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigillinBubbles from './SigillinBubbles';

it('renders bubbles', () => {
  render(<SigillinBubbles bubbles={[{ id: '1', label: 'A' }]} />);
  expect(screen.getByLabelText('Sigillin Bubbles')).toBeInTheDocument();
  expect(screen.getByText('A')).toBeInTheDocument();
});
