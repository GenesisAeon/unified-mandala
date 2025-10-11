import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MandalaCanvas from './MandalaCanvas';
import CREPVisualizer from './CREPVisualizer';

test('MandalaCanvas calls onModuleSelect when module button clicked', () => {
  const onSelect = jest.fn();
  const { getByText } = render(
    <MandalaCanvas
      boundaryRules={[]}
      pantheonEvents={[]}
      modules={['m1']}
      onModuleSelect={onSelect}
    />,
  );
  fireEvent.click(getByText('m1'));
  expect(onSelect).toHaveBeenCalledWith('m1');
});

test('CREPVisualizer renders timeline axis', () => {
  const { getByLabelText } = render(
    <CREPVisualizer history={[{ timestamp: new Date(1), C: 1, R: 1, E: 1, P: 1 }]} />,
  );
  const svg = getByLabelText('CREP Visualizer');
  expect(svg.querySelector('line')).toBeInTheDocument();
});
