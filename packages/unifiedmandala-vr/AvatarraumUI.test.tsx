import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvatarraumUI from './AvatarraumUI';

test('renders avatarraum UI', () => {
  render(<AvatarraumUI />);
  expect(screen.getByLabelText('avatarraum-ui')).toBeInTheDocument();
});
