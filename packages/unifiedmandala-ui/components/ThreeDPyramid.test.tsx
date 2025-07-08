import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ThreeDPyramid from './ThreeDPyramid';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div>{children}</div>,
  useFrame: () => {},
  coneGeometry: 'coneGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
  pointLight: 'pointLight',
}));

test('renders pyramid layers', () => {
  const { getByLabelText } = render(<ThreeDPyramid layers={2} />);
  expect(getByLabelText('pyramid-layer-0')).toBeInTheDocument();
  expect(getByLabelText('pyramid-layer-1')).toBeInTheDocument();
});
