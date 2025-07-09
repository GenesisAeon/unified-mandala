import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PyramidVRView from './PyramidVRView';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div role="presentation">{children}</div>,
  coneGeometry: 'coneGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
}));

test('renders VR pyramid mesh', () => {
  const { getByLabelText } = render(<PyramidVRView />);
  expect(getByLabelText('vr-pyramid')).toBeInTheDocument();
});
