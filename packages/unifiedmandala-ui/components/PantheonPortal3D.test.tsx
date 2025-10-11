import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PantheonPortal3D from './PantheonPortal3D';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div>{children}</div>,
  ambientLight: 'ambientLight',
  pointLight: 'pointLight',
  boxGeometry: 'boxGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
}));

test('renders modules as meshes', () => {
  const { getByLabelText } = render(<PantheonPortal3D modules={['A', 'B']} />);
  expect(getByLabelText('module-A')).toBeInTheDocument();
  expect(getByLabelText('module-B')).toBeInTheDocument();
});
