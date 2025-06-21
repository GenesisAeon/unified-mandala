import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPConvoHeatmap from './CREPConvoHeatmap';

test('renders svg heatmap', () => {
  render(<CREPConvoHeatmap data={[{ time: 't1', value: 0.5 }]} />);
  expect(screen.getByLabelText('CREP Heatmap')).toBeInTheDocument();
});
