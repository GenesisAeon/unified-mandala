import { SymbolzeitMLForecaster, forecastSymbolzeit } from './SymbolzeitMLForecaster';

test('forecasts next symbolzeit with helper', () => {
  expect(forecastSymbolzeit([1, 2, 3])).toBeCloseTo(4);
});

test('forecasts next symbolzeit using class', () => {
  const forecaster = new SymbolzeitMLForecaster();
  forecaster.train([2, 4, 6]);
  expect(forecaster.forecastNext()).toBeCloseTo(8);
});
