import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigilCard from './SigilCard';

test('renders sigil card content', () => {
  render(<SigilCard sigil="S1" description="demo" />);
  expect(screen.getByText('S1')).toBeInTheDocument();
  expect(screen.getByText('demo')).toBeInTheDocument();
});
