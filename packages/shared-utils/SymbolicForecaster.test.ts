import { forecastNextSymbolzeit } from './SymbolicForecaster';

test('forecasts next phase', () => {
  const date = new Date('2020-01-01T10:00:00Z');
  const forecast = forecastNextSymbolzeit(date);
  expect(forecast.phase).toBe('tag');
});
