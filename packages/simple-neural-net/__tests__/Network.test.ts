import { Network } from '../Network';

test('trains towards sample data', () => {
  const data: [number, number][] = [
    [115, 66],
    [175, 78],
    [205, 72],
    [120, 67]
  ];
  const answers = [1, 0, 0, 1];
  const net = new Network();
  net.train(data, answers, 10);
  const out = net.predict(115, 66);
  expect(typeof out).toBe('number');
});
