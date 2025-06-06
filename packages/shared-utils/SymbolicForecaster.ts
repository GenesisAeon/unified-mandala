export type Symbolzeit = 'morgen' | 'tag' | 'abend' | 'nacht';

export interface Forecast {
  phase: Symbolzeit;
  at: Date;
}

export function forecastNextSymbolzeit(date = new Date()): Forecast {
  const d = new Date(date);
  const h = d.getHours();
  if (h < 5) {
    d.setHours(5, 0, 0, 0);
    return { phase: 'morgen', at: d };
  }
  if (h < 12) {
    d.setHours(12, 0, 0, 0);
    return { phase: 'tag', at: d };
  }
  if (h < 18) {
    d.setHours(18, 0, 0, 0);
    return { phase: 'abend', at: d };
  }
  if (h < 22) {
    d.setHours(22, 0, 0, 0);
    return { phase: 'nacht', at: d };
  }
  d.setDate(d.getDate() + 1);
  d.setHours(5, 0, 0, 0);
  return { phase: 'morgen', at: d };
}
