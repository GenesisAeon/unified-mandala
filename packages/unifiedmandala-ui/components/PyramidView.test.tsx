import React from 'react';
import { render } from '@testing-library/react';
import PyramidView from './PyramidView';
import { PyramidConfig } from '../pyramid/PyramidConfig';

jest.mock('@react-three/fiber', () => ({ Canvas: ({ children }: any) => <div>{children}</div>, coneGeometry: 'coneGeometry', mesh: 'mesh', meshStandardMaterial: 'meshStandardMaterial', ambientLight: 'ambientLight', pointLight: 'pointLight' }));

test('renders layers', () => {
  const config: PyramidConfig = { layers: [{ name: 'a', weight: 1 }] };
  const { getByLabelText } = render(<PyramidView config={config} />);
  expect(getByLabelText('Pyramid visualization')).toBeInTheDocument();
  expect(getByLabelText('layer-0')).toBeInTheDocument();
});
