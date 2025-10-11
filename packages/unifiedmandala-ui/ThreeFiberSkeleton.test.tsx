import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ThreeFiberSkeleton from './ThreeFiberSkeleton';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  ambientLight: 'ambientLight',
  mesh: 'mesh',
  boxGeometry: 'boxGeometry',
  meshStandardMaterial: 'meshStandardMaterial',
}));

test('renders three-fiber skeleton', () => {
  const { getByTestId } = render(<ThreeFiberSkeleton />);
  expect(getByTestId('canvas')).toBeInTheDocument();
});
