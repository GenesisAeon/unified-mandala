import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NestedCanvas from '../NestedCanvas';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  group: 'group',
  mesh: 'mesh',
  boxGeometry: 'boxGeometry',
  meshStandardMaterial: 'meshStandardMaterial'
}));

test('renders canvas element', () => {
  const { getByTestId } = render(<NestedCanvas />);
  expect(getByTestId('canvas')).toBeInTheDocument();
});
