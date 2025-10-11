import { mapToMemory, Chamber } from './KammerTopologie';

test('maps chambers to memory ids', () => {
  const chambers: Chamber[] = [
    { name: 'king', coordinates: [0, 0, 0] },
    { name: 'queen', coordinates: [1, 1, 1] },
  ];
  expect(mapToMemory(chambers)).toEqual({ king: 'mem_0', queen: 'mem_1' });
});
