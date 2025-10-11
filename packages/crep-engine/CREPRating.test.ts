import { rateCREP } from './CREPRating';

test('rates high values as high', () => {
  expect(rateCREP({ C: 5, R: 5, E: 5, P: 5 })).toBe('high');
});

test('rates medium values', () => {
  expect(rateCREP({ C: 3, R: 3, E: 3, P: 2 })).toBe('medium');
});

test('rates low values', () => {
  expect(rateCREP({ C: 1, R: 1, E: 1, P: 1 })).toBe('low');
});
