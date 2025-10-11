import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PyramidBlueprint from './PyramidBlueprint';

jest.mock('./NestedPyramid', () => ({
  __esModule: true,
  default: ({ root }: any) => <div data-testid="nested-pyramid">{JSON.stringify(root)}</div>,
}));

test('renders nested pyramid with default levels', () => {
  render(<PyramidBlueprint />);
  const div = screen.getByTestId('nested-pyramid');
  expect(div).toBeInTheDocument();
  const root = JSON.parse(div.textContent || '{}');
  expect(root.index).toBe(0);
  expect(root.children).toBeDefined();
});
