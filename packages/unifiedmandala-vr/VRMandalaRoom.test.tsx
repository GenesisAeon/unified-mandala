import { render } from '@testing-library/react';
import VRMandalaRoom from './VRMandalaRoom';

global.WebSocket = class {
  close() {}
  constructor(public url: string) {}
} as any;

test('renders mandala sphere', () => {
  const { getByLabelText } = render(<VRMandalaRoom />);
  expect(getByLabelText('vr-mandala-room')).toBeInTheDocument();
});
