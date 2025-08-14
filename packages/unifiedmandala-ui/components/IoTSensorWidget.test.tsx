import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IoTSensorWidget from './IoTSensorWidget';

test('displays sensor label, value and unit', () => {
  render(<IoTSensorWidget label="Temperature" value={21.5} unit="°C" />);
  const widget = screen.getByTestId('iot-sensor-widget');
  expect(widget).toHaveTextContent('Temperature');
  expect(widget).toHaveTextContent('21.5');
  expect(widget).toHaveTextContent('°C');
});
