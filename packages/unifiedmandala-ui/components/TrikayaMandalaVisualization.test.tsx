import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrikayaMandalaVisualization from './TrikayaMandalaVisualization';

test('renders three layers', () => {
  render(<TrikayaMandalaVisualization />);
  expect(screen.getByTestId('Nirmanakaya')).toBeInTheDocument();
  expect(screen.getByTestId('Sambhogakaya')).toBeInTheDocument();
  expect(screen.getByTestId('Dharmakaya')).toBeInTheDocument();
});
