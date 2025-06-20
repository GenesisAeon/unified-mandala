import { suggestSigillins } from './SigillinSuggestionEngine';

jest.mock('./SigillinGenerator', () => ({
  SigillinGenerator: (id: string) => ({ id })
}));

test('suggests ids', () => {
  const ids = suggestSigillins([1,2,3]);
  expect(ids).toEqual(['suggestion-1','suggestion-2','suggestion-3']);
});
