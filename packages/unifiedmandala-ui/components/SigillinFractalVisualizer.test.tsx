import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigillinFractalVisualizer from './SigillinFractalVisualizer';

test('renders fractal pieces for each sigil', () => {
  const data = [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 },
  ];
  render(<SigillinFractalVisualizer sigillinData={data} />);
  const pieces = screen.getAllByTestId('fractal-piece');
  expect(pieces).toHaveLength(2);
});
