import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRAvatarHub from '../VRAvatarHub';

test('renders avatar hub', () => {
  render(<VRAvatarHub />);
  expect(screen.getByText('VR Avatar Hub')).toBeInTheDocument();
});
