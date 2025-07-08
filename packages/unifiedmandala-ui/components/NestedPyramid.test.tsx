import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NestedPyramid from './NestedPyramid';
import { generateNestedLayers } from '../pyramid/generateNestedLayers';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div>{children}</div>,
  coneGeometry: 'coneGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
  pointLight: 'pointLight'
}));

test('renders nested pyramid layers', () => {
  const root = generateNestedLayers(2);
  const { getByLabelText } = render(<NestedPyramid root={root} />);
  expect(getByLabelText('nested-layer-0')).toBeInTheDocument();
  expect(getByLabelText('nested-layer-1')).toBeInTheDocument();
});
