import { generateGespraechsfall } from './GespraechsfallGenerator';

describe('generateGespraechsfall', () => {
  it('returns object with timestamp', () => {
    const g = generateGespraechsfall('hi', 'there');
    expect(g.prompt).toBe('hi');
    expect(g.response).toBe('there');
    expect(typeof g.timestamp).toBe('string');
  });
});
