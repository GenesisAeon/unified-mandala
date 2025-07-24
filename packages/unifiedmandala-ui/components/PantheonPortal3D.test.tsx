import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PantheonPortal3D from './PantheonPortal3D';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => <div aria-label={props['aria-label']}>{children}</div>,
  ambientLight: 'ambientLight',
  mesh: 'mesh',
  boxGeometry: 'boxGeometry',
  meshStandardMaterial: 'meshStandardMaterial'
}));

test('renders 3D portal canvas', () => {
  const { getByLabelText } = render(<PantheonPortal3D />);
  expect(getByLabelText('pantheon-portal-3d')).toBeInTheDocument();
});
