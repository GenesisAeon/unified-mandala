import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRExperienceRoom from './VRExperienceRoom';

global.WebSocket = class {
  close() {}
  constructor(public url: string) {}
} as any;

jest.mock('./VRBegegnungsraum', () => {
  return {
    VRBegegnungsraum: class {
      join() {
        return Promise.resolve('ok');
      }
      handshake() {}
      onHandshake() {}
    },
  };
});

jest.mock('./VRBoundaryConductor', () => {
  return {
    VRBoundaryConductor: class {
      constructor() {}
      start() {}
      stop() {}
    },
  };
});

jest.mock('../pantheon/PantheonBoundaryBridge', () => {
  return { PantheonBoundaryBridge: class {} };
});

test('renders VR experience room', () => {
  const { getByLabelText } = render(<VRExperienceRoom url="scene.glb" />);
  expect(getByLabelText('vr-experience-room')).toBeInTheDocument();
});
