import { ScalePlugin } from './FourierLayerPlugin';

test('ScalePlugin multiplies data', () => {
  const plugin = new ScalePlugin(2);
  expect(plugin.transform([1, 2])).toEqual([2, 4]);
});
