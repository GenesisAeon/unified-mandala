import React from 'react';
import '@testing-library/jest-dom';
import { VRBegegnungsraum } from '../VRBegegnungsraum';

const MockMandalaCanvas = jest.fn(() => <canvas data-testid="mandala" />);
jest.mock('../../unifiedmandala-ui/components/MandalaCanvas', () => ({ __esModule: true, default: MockMandalaCanvas }));

describe('VRBegegnungsraum render', () => {
  test('renders MandalaCanvas', () => {
    const container = document.createElement('div');
    const loader = { load: jest.fn() } as any;
    const room = new VRBegegnungsraum(loader);
    room.render(container, ['r1'], ['e1']);
    expect(MockMandalaCanvas).toHaveBeenCalledWith({ boundaryRules: ['r1'], pantheonEvents: ['e1'] }, {});
  });
});
