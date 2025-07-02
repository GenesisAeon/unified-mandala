import { forecastSymbolzeit } from './SymbolzeitMLForecaster';

test('forecasts next symbolzeit', () => {
  expect(forecastSymbolzeit(3)).toBe(4);
});
